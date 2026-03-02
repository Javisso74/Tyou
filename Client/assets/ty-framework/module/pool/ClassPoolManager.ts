// ClassPoolManager.ts
import { ClassPool, IClassPoolConfig } from "./ClassPool";

/**
 * 类对象池管理器
 */
export class ClassPoolManager {
    // 池管理
    private readonly _pools: Map<string, ClassPool<any>> = new Map();

    // 默认配置
    private _defaultMaxCapacity: number = 200;
    private _defaultCleanupInterval: number = 10; // 秒
    private _defaultPreloadCount: number = 1;

    /**
     * 设置默认配置
     */
    public setDefaultConfig(config: {
        maxCapacity?: number;
        cleanupInterval?: number;
        preloadCount?: number;
    }): void {
        if (config.maxCapacity !== undefined) {
            this._defaultMaxCapacity = Math.max(1, config.maxCapacity);
        }
        if (config.cleanupInterval !== undefined) {
            this._defaultCleanupInterval = Math.max(0, config.cleanupInterval);
        }
        if (config.preloadCount !== undefined) {
            this._defaultPreloadCount = Math.max(0, config.preloadCount);
        }
    }

    /**
     * 使用类对象池（自动创建或获取池子）
     */
    public use<T extends object, R>(
        configName: string,
        constructor: new () => T,
        callback: (obj: T) => R,
        resetFunc?: (obj: T) => void
    ): R {
        const pool = this.getOrCreateDefaultPool(configName, constructor, resetFunc);
        return pool.use(callback);
    }

    /**
     * 获取或创建默认配置的池子
     */
    public getOrCreateDefaultPool<T extends object>(
        configName: string,
        constructor: new () => T,
        resetFunc?: (obj: T) => void
    ): ClassPool<T> {
        let pool = this.getPool<T>(configName);
        if (!pool) {
            // 创建默认配置的池子
            pool = this.createPool({
                poolName: configName,
                constructor,
                maxCapacity: this._defaultMaxCapacity,
                cleanupInterval: this._defaultCleanupInterval,
                preloadCount: this._defaultPreloadCount,
                resetFunc
            });
        }
        return pool;
    }

    /**
     * 直接获取对象（需手动归还）
     */
    public get<T extends object>(
        configName: string,
        constructor?: new () => T,
        resetFunc?: (obj: T) => void
    ): T {
        let pool: ClassPool<T>;
        if (constructor) {
            pool = this.getOrCreateDefaultPool(configName, constructor, resetFunc);
        } else {
            pool = this.getPool<T>(configName);
            if (!pool) {
                throw new Error(`类对象池不存在: ${configName}，请提供构造函数`);
            }
        }
        return pool.get();
    }

    /**
     * 归还对象
     */
    public release<T extends object>(configName: string, obj: T): void {
        const pool = this.getPool<T>(configName);
        if (pool) {
            pool.release(obj);
        } else {
            console.warn(`类对象池不存在: ${configName}，无法归还对象`);
        }
    }

    /**
     * 创建类对象池
     */
    public createPool<T extends object>(config: IClassPoolConfig<T>): ClassPool<T> {
        const poolName = config.poolName;

        // 检查是否已存在
        if (this._pools.has(poolName)) {
            console.warn(`类对象池已存在: ${poolName}`);
            return this._pools.get(poolName)!;
        }

        // 使用默认值填充配置
        const fullConfig: IClassPoolConfig<T> = {
            ...config,
            maxCapacity: config.maxCapacity || this._defaultMaxCapacity,
            cleanupInterval: config.cleanupInterval ?? this._defaultCleanupInterval,
            preloadCount: config.preloadCount || 0
        };

        // 创建池
        const pool = new ClassPool<T>(fullConfig);
        this._pools.set(poolName, pool);

        console.log(`创建类对象池: ${poolName}`);
        return pool;
    }

    /**
     * 获取类对象池
     */
    public getPool<T extends object>(poolName: string): ClassPool<T> | null {
        return this._pools.get(poolName) as ClassPool<T> || null;
    }

    /**
     * 获取或创建类对象池
     */
    public getOrCreatePool<T extends object>(config: IClassPoolConfig<T>): ClassPool<T> {
        const pool = this.getPool<T>(config.poolName);
        if (pool) {
            return pool;
        }
        return this.createPool(config);
    }

    /**
     * 移除类对象池
     */
    public removePool(poolName: string): boolean {
        const pool = this.getPool(poolName);
        if (pool) {
            pool.destroy();
            this._pools.delete(poolName);
            console.log(`移除类对象池: ${poolName}`);
            return true;
        }
        return false;
    }

    /**
     * 更新所有池
     */
    public onUpdate(dt: number): void {
        for (const pool of this._pools.values()) {
            pool.update(dt);
        }
    }

    /**
     * 销毁所有池
     */
    public onDestroy(): void {
        for (const pool of this._pools.values()) {
            pool.destroy();
        }
        this._pools.clear();
        console.log("类对象池管理器已销毁");
    }
}