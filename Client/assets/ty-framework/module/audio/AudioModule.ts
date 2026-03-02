import {AudioClip, AudioSource, director, find, Node} from "cc";
import {Module} from "../Module";

export enum AudioType {
    BGM = 'bgm',
    EFFECT = 'effect'
}

// 声音等级枚举（数值越小优先级越高）
export enum AudioPriority {
    BGM = 0,      // 背景音乐 (最高)
    VOICE = 1,    // 对话/对白
    UI = 2,       // UI音效
    EFFECT = 3,   // 普通音效
    LOWEST = 4    // 最低优先级（如小怪脚步声等可忽略的声音）
}

// 音频配置接口
export interface AudioConfig {
    path: string;      // 音频路径（在bundle中的相对路径）
    loop?: boolean;    // 是否循环
    type?: AudioType;  // 音频类型
    id?: string;       // 添加唯一标识
    priority?: number; // 优先级
}

interface AudioCache {
    clip: AudioClip;
    refCount: number;  // 引用计数
    lastUsedTime: number; // 最后使用时间戳
}

export class AudioModule extends Module {
    // 微信小游戏等平台通常限制 AudioSource 数量，设置为 10
    private readonly MAX_AUDIO_SOURCES: number = 10;
    
    private _initPoolSize: number = 3;
    private _audioNode: Node = null;
    private _audioPool: AudioSource[] = [];
    private _activeAudios: Map<AudioSource, AudioConfig> = new Map();
    private _currentBGM: AudioSource = null;
    private _audioCache: Map<string, AudioCache> = new Map();
    
    /**
     * 初始化模块
     */
    public onCreate(): void {
        const node = new Node('AudioModule');
        const parentNode = find("GameRoot");
        if (parentNode) {
            node.setParent(parentNode);
        }
        this._audioNode = node;
        this._initAudioPool();
    }

    /**
     * 销毁模块
     */
    public onDestroy(): void {
        // 清理所有音频
        this.stopAll();
        this._activeAudios.clear();
        this._audioPool = [];

        // 清理缓存
        this._clearAllCache();
        
        if (this._audioNode && this._audioNode.isValid) {
            this._audioNode.destroy();
        }
    }

    /**
     * 更新方法
     */
    public onUpdate(dt: number): void {
        // 检查是否有播放结束的非循环音频需要回池
        this._activeAudios.forEach((config, audioSource) => {
            // 使用 playing 属性判断播放状态
            // 只要不是正在播放 且 没有暂停，就认为是播放结束了
            if (!config.loop && !audioSource.playing && audioSource.state !== AudioSource.AudioState.PAUSED) {
                this._returnToPool(audioSource);
            }
        });
    }

    /**
     * 初始化音频池
     */
    private _initAudioPool(): void {
        const count = Math.min(this._initPoolSize, this.MAX_AUDIO_SOURCES);
        for (let i = 0; i < count; i++) {
            this._createAudioSource();
        }
    }

    /**
     * 创建音频源
     */
    private _createAudioSource(): AudioSource {
        const node = new Node(`AudioSource_${this._audioPool.length}`);
        this._audioNode.addChild(node);

        const audioSource = node.addComponent(AudioSource);
        audioSource.volume = 1.0;

        this._audioPool.push(audioSource);
        return audioSource;
    }

    /**
     * 获取可用的音频源（支持优先级抢占）
     * @param priority 请求的音频优先级
     */
    private _getAvailableAudioSource(priority: number): AudioSource | null {
        // 1. 查找空闲的音频源
        for (const audioSource of this._audioPool) {
            if (!audioSource.playing && !this._activeAudios.has(audioSource)) {
                return audioSource;
            }
        }

        // 2. 如果没有空闲的，且未达上限，创建新的
        if (this._audioPool.length < this.MAX_AUDIO_SOURCES) {
            return this._createAudioSource();
        }

        // 3. 如果已达上限，尝试抢占优先级更低的音频
        // 规则：优先级数值越小越重要。只能抢占 priority 数值比当前大的（即优先级更低的）。
        // 不能抢占平级或更高级的。
        
        let bestCandidate: AudioSource | null = null;
        let lowestPriorityFound = -1; // 记录找到的最低优先级（数值最大）

        this._activeAudios.forEach((config, source) => {
            const currentPriority = config.priority ?? AudioPriority.EFFECT;
            // 寻找优先级最低的（数值最大）
            if (currentPriority > lowestPriorityFound) {
                lowestPriorityFound = currentPriority;
                bestCandidate = source;
            }
        });

        // 只有当 找到的最低优先级 > 请求的优先级 时，才可以抢占
        // 例如：请求 UI(2)，找到最低是 LOWEST(4)，4 > 2，可以抢占。
        // 例如：请求 EFFECT(3)，找到最低是 EFFECT(3)，3 > 3 不成立，不可抢占平级。
        if (bestCandidate && lowestPriorityFound > priority) {
            // console.log(`[AudioModule] 发生抢占: Priority ${priority} 挤掉了 Priority ${lowestPriorityFound} (${this._activeAudios.get(bestCandidate)?.path})`);
            
            // 强制回收该音频源
            this._returnToPool(bestCandidate);
            // 返回该音频源（此时它已停止并处于空闲状态）
            return bestCandidate;
        }

        // 4. 无法抢占，返回空
        return null;
    }

    /**
     * 播放背景音乐
     * BGM 默认为最高优先级
     */
    public playBGM(path: string, loop: boolean = true): void {
        // 停止当前BGM
        if (this._currentBGM && this._currentBGM.playing) {
            this._currentBGM.stop();
            this._returnToPool(this._currentBGM);
        }
        this.playAudio({
            path, 
            loop, 
            type: AudioType.BGM, 
            priority: AudioPriority.BGM
        });
    }

    /**
     * 播放音效
     * @param path 音频路径
     * @param loop 是否循环
     * @param priority 优先级，默认为 EFFECT (3)。对于不重要的声音（如大量小怪脚步），建议传入 AudioPriority.LOWEST (4)
     */
    public playEffect(path: string, loop: boolean = false, priority: number = AudioPriority.EFFECT): void {
        this.playAudio({
            path, 
            loop, 
            type: AudioType.EFFECT, 
            priority: priority
        });
    }

    /**
     * 兼容旧接口：播放一次性音效
     * 改为使用 playEffect 实现，优先级设为 LOWEST，确保不会挤掉重要声音
     */
    public playOneShotSafe(path: string, volume: number = 1.0): void {
        // 为了兼容旧逻辑的 volume 参数，这里稍微特殊处理一下，但核心还是走 playAudio
        // 注意：playAudio 内部会重置 volume 为 1.0 (如果 audioSource 复用)，或者我们需要在 config 里支持 volume
        // 简单起见，这里直接调用 playEffect，如果需要控制 volume，playEffect 目前不支持单独设置 volume
        // 既然用户说"不想用playOneShot因为没有办法控制加速暂停等"，那么 playEffect 是推荐方式。
        // 这里只是为了兼容旧代码不报错，将其导向 playEffect (优先级最低)
        this.playEffect(path, false, AudioPriority.LOWEST);
    }

    /**
     * 播放音频核心逻辑
     */
    private async playAudio(config: AudioConfig): Promise<void> {
        const {path, loop = false, type = AudioType.EFFECT, priority = AudioPriority.EFFECT} = config;
        
        try {
            // 1. 获取音频源（可能触发抢占）
            // 注意：这里先获取音频源再加载资源，或者先加载资源再获取音频源？
            // 如果先加载资源（异步），可能加载完后情况变了。
            // 但如果先占坑，异步加载期间占着坑不拉屎也不好。
            // 考虑到资源加载通常有缓存，这里选择：先加载资源，再申请坑位。
            
            // 加载音频资源
            const audioClip = await this._loadAudioClip(path);
            if (!audioClip) {
                console.error(`音频资源加载失败: path=${path}`);
                return;
            }

            // 再次申请音频源（因为 await 之后状态可能改变）
            const audioSource = this._getAvailableAudioSource(priority);
            
            if (!audioSource) {
                // 申请失败（满了且优先级不够），直接放弃播放
                // 记得减少引用计数，因为 loadAudioClip 增加了引用（如果是新加载的）? 
                // 不，_loadAudioClip 内部只是返回 clip，引用计数是在 play 成功后 _addAudioRef 增加的？
                // 查看原代码：_loadAudioClip 内部没有 active ref logic，引用计数是在 playAudio 成功后调用的 _addAudioRef。
                // 但是 _loadAudioClip 内部有 cache ref logic? 
                // 原代码 _loadAudioClip: if in cache, return. if not, load and set to cache (refCount 0).
                // playAudio: success -> _addAudioRef (refCount++).
                // 所以如果这里 return 了，refCount 还是 0，没问题。cache 会保留。
                // console.warn(`[AudioModule] 音频播放被丢弃 (优先级不足): ${path}`);
                return;
            }

            // 配置音频源
            audioSource.clip = audioClip;
            audioSource.loop = loop;
            audioSource.volume = 1.0; // 重置音量，如果需要支持 config.volume 可在此修改

            // 生成唯一ID
            const audioId = `${Date.now()}_${Math.random()}`;
            const audioConfigWithId = {...config, id: audioId, priority};

            // 记录活动音频
            this._activeAudios.set(audioSource, audioConfigWithId);

            // 播放
            audioSource.play();

            // 增加音频资源的引用计数
            this._addAudioRef(path);

            // 如果是BGM，记录当前BGM
            if (type === AudioType.BGM) {
                this._currentBGM = audioSource;
            }

            // 循环播放不需要设置自动回池定时器（由 onUpdate 或 手动 stop 处理）
            // 非循环播放：虽然 onUpdate 会检测 stopped 状态，但为了保险（防止 update 漏掉或延迟），
            // 原代码加了 setTimeout。保留这个逻辑作为双重保障，或者依赖 onUpdate 也可以。
            // 为了高性能，依赖 onUpdate 其实足够。原代码的 setTimeout 可能会导致闭包引用等问题。
            // 鉴于 onUpdate 已经在运行，我们尽量依赖 onUpdate，减少 timer 开销。
            // 但考虑到 precision，保留原逻辑也可以，这里选择精简，主要依赖 onUpdate。
            
        } catch (error) {
            console.error(`播放音频失败: path=${path}`, error);
        }
    }

    /**
     * 加载音频剪辑
     */
    private async _loadAudioClip(path: string): Promise<AudioClip | null> {
        const cacheKey = path;
        // 检查缓存
        if (this._audioCache.has(cacheKey)) {
            const cache = this._audioCache.get(cacheKey)!;
            cache.lastUsedTime = Date.now();
            return cache.clip;
        }

        try {
            const clip = await tyou.res.loadAssetAsync(path) as unknown as AudioClip;
            if (clip) {
                // 存入缓存
                this._audioCache.set(cacheKey, {
                    clip: clip!,
                    refCount: 0,
                    lastUsedTime: Date.now()
                });
            }
            return clip;
        } catch (error) {
            console.error(`加载音频资源失败: ${cacheKey}`, error);
            return null;
        }
    }

    /**
     * 添加音频引用计数
     */
    private _addAudioRef(path: string): void {
        const cacheKey = path;
        const cache = this._audioCache.get(cacheKey);
        if (cache) {
            cache.refCount++;
            cache.lastUsedTime = Date.now();
        }
    }

    /**
     * 释放音频引用
     */
    private _releaseAudioRef(path: string): void {
        const cacheKey = path;
        const cache = this._audioCache.get(cacheKey);
        if (cache) {
            cache.refCount--;
            cache.lastUsedTime = Date.now();
            if (cache.refCount < 0) {
                console.warn(`音频资源 ${path} 引用计数异常: ${cache.refCount}`);
                cache.refCount = 0;
            }

            if (cache.refCount === 0) {
                // console.log(`释放音频资源: ${cacheKey}`);
                // 从缓存中移除
                this._audioCache.delete(cacheKey);
                tyou.res.decRef(cache.clip);
            }
        }
    }

    /**
     * 停止所有音频
     */
    public stopAll(): void {
        this._activeAudios.forEach((config, audioSource) => {
            audioSource.stop();
            this._returnToPool(audioSource);
        });

        this._currentBGM = null;
    }

    /**
     * 按类型停止音频
     */
    public stopByType(type: AudioType): void {
        this._activeAudios.forEach((config, audioSource) => {
            if (config.type === type) {
                audioSource.stop();
                this._returnToPool(audioSource);

                if (type === AudioType.BGM && audioSource === this._currentBGM) {
                    this._currentBGM = null;
                }
            }
        });
    }

    /**
     * 停止指定音频源
     */
    public stopAudio(audioSource: AudioSource): void {
        if (audioSource && audioSource.playing) {
            audioSource.stop();
            this._returnToPool(audioSource);

            if (audioSource === this._currentBGM) {
                this._currentBGM = null;
            }
        }
    }

    /**
     * 设置音量
     */
    public setVolume(type: AudioType, volume: number): void {
        this._activeAudios.forEach((config, audioSource) => {
            if (config.type === type) {
                audioSource.volume = Math.max(0, Math.min(1, volume));
            }
        });
    }

    /**
     * 设置BGM音量
     */
    public setBGMVolume(volume: number): void {
        this.setVolume(AudioType.BGM, volume);
    }

    /**
     * 设置音效音量
     */
    public setEffectVolume(volume: number): void {
        this.setVolume(AudioType.EFFECT, volume);
    }

    /**
     * 暂停所有音频
     */
    public pauseAll(): void {
        this._activeAudios.forEach((config, audioSource) => {
            audioSource.pause();
        });
    }

    /**
     * 恢复所有音频
     */
    public resumeAll(): void {
        this._activeAudios.forEach((config, audioSource) => {
            if (!audioSource.playing) {
                audioSource.play();
            }
        });
    }

    /**
     * 返回音频源到池中
     */
    private _returnToPool(audioSource: AudioSource): void {
        if (audioSource && this._activeAudios.has(audioSource)) {
            const config = this._activeAudios.get(audioSource)!;

            // 确保停止
            if (audioSource.playing) {
                audioSource.stop();
            }

            // 释放音频资源引用
            if (audioSource.clip) {
                this._releaseAudioRef(config.path);
                audioSource.clip = null;
            }

            // 从活动列表中移除
            this._activeAudios.delete(audioSource);

            // 如果是BGM，清空引用
            if (audioSource === this._currentBGM) {
                this._currentBGM = null;
            }

            // console.log(`音频源回池，当前活动音频数: ${this._activeAudios.size}`);
        }
    }

    /**
     * 预加载音频
     */
    public preloadAudios(paths: string[]): void {
        for (const path of paths) {
            tyou.res.preload(path);
        }
    }

    /**
     * 清理所有缓存
     */
    private _clearAllCache(): void {
        this._audioCache.forEach((cache, key) => {
            tyou.res.decRef(cache.clip);
        });
        this._audioCache.clear();
        console.log('清理所有音频缓存');
    }

    /**
     * 获取活动音频数量
     */
    public getActiveAudioCount(): number {
        return this._activeAudios.size;
    }

    /**
     * 获取池大小
     */
    public getPoolSize(): number {
        return this._audioPool.length;
    }

    /**
     * 获取缓存大小
     */
    public getCacheSize(): number {
        return this._audioCache.size;
    }

    /**
     * 根据路径停止并返回音频源
     */
    public stopAndReturnByPath(path: string, type?: AudioType): void {
        const toStop: AudioSource[] = [];

        this._activeAudios.forEach((config, audioSource) => {
            if (config.path === path && (!type || config.type === type)) {
                toStop.push(audioSource);
            }
        });

        toStop.forEach(audioSource => {
            this._returnToPool(audioSource);
        });
    }

    /**
     * 停止并返回所有循环音频
     */
    public stopAndReturnAllLoop(): void {
        const toStop: AudioSource[] = [];

        this._activeAudios.forEach((config, audioSource) => {
            if (config.loop) {
                toStop.push(audioSource);
            }
        });

        toStop.forEach(audioSource => {
            this._returnToPool(audioSource);
        });
    }

    /**
     * 按类型停止并返回循环音频
     */
    public stopAndReturnLoopByType(type: AudioType): void {
        const toStop: AudioSource[] = [];

        this._activeAudios.forEach((config, audioSource) => {
            if (config.loop && config.type === type) {
                toStop.push(audioSource);
            }
        });

        toStop.forEach(audioSource => {
            this._returnToPool(audioSource);
        });
    }

    /**
     * 根据路径获取音频源
     */
    public getAudioSourcesByPath(path: string): AudioSource[] {
        const sources: AudioSource[] = [];

        this._activeAudios.forEach((config, audioSource) => {
            if (config.path === path) {
                sources.push(audioSource);
            }
        });

        return sources;
    }

    /**
     * 强制释放音频资源
     */
    public forceReleaseAudio(path: string): void {
        const cacheKey = path;
        const cache = this._audioCache.get(cacheKey);

        if (cache) {
            console.log(`强制释放音频资源: ${path}，当前引用: ${cache.refCount}`);

            // 停止所有正在播放的该音频
            this.stopAndReturnByPath(path);

            // 强制释放资源
            this._audioCache.delete(cacheKey);
            tyou.res.decRef(cache.clip);

            console.log(`音频资源 ${path} 已强制释放`);
        }
    }
}
