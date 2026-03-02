import {director, SceneAsset, Asset} from "cc";
import {LoginScene, SceneBase, SceneEnum} from "./Scene";
import {Module} from "../Module";

export class SceneModule extends Module {
    private _currentScene: SceneBase | null = null;
    private _isSwitching: boolean = false;
    private _sceneCache: Map<string, SceneBase> = new Map();
    
    public onCreate(): void {
        this._isSwitching = false;
        this.initialize();
    }

    /**
     * 初始化场景模块
     */
    public initialize(): void {
        this._sceneCache.clear();
        this._sceneCache.set(SceneEnum.Login, new LoginScene(SceneEnum.Login));
        this._sceneCache.set(SceneEnum.Game, new LoginScene(SceneEnum.Game));
    }

    public onDestroy(): void {
        // 清理资源
    }

    /**
     * 添加自动释放的资源
     */
    public addAutoReleaseAsset(asset: Asset): void {
        if (this._currentScene) {
            this._currentScene.addAutoReleaseAsset(asset);
        } else {
            this.log("当前没有任何场景 检查资源加载时机");
        }
    }

    /**
     * 异步加载场景
     */
    public async loadSceneAsync(path: SceneEnum, data?: any): Promise<void> {
        this.log("loadSceneAsync path",path,this._sceneCache.size, this._sceneCache.has(path));
        if (this._isSwitching) {
            this.log(" 上个场景还在加载中");
            return;
        }

        if (this._currentScene && this._currentScene.sceneName === path) {
            this.log(" 加载同样的场景", path);
            return;
        }

        const newScene = this._sceneCache.get(path);
        if (!newScene) {
            this.log(" 场景没有注册", path);
            return;
        }

        this._isSwitching = true;

        if (this._currentScene) {
            this._currentScene.onLeave();
        }

        const asset = await tyou.res.loadAssetAsync(path) as unknown as SceneAsset;

        director.runSceneImmediate(asset, null, () => {
            this.log(`切换场景: ${path}`);
            newScene.onInit(asset);
            newScene.onEnter(data);
            this._currentScene = newScene;
            this._isSwitching = false;

            // 查看场景的引用
            this._sceneCache.forEach(scene => {
                this.log("场景", scene.sceneName, scene.sceneAsset?.refCount);
            });
        });
    }

    /**
     * 获取当前场景
     */
    public getCurrentScene(): SceneBase | null {
        return this._currentScene;
    }

    /**
     * 检查是否正在切换场景
     */
    public isSwitching(): boolean {
        return this._isSwitching;
    }

    /**
     * 注册场景
     */
    public registerScene(scene: SceneBase): void {
        this._sceneCache.set(scene.sceneName, scene);
    }

    /**
     * 取消注册场景
     */
    public unregisterScene(sceneName: string): void {
        this._sceneCache.delete(sceneName);
    }

    /**
     * 获取场景实例
     */
    public getScene(sceneName: string): SceneBase | null {
        return this._sceneCache.get(sceneName) || null;
    }

    /**
     * 获取所有已注册的场景名称
     */
    public getAllSceneNames(): string[] {
        return Array.from(this._sceneCache.keys());
    }
}