// Singleton.ts
export abstract class Singleton<T> {
    private static _instances: Map<Function, any> = new Map();

    constructor() {
        // 保护构造函数，防止直接实例化
        const className = this.constructor;
        if (Singleton._instances.has(className)) {
            throw new Error(`Cannot create multiple instances of singleton class ${className.name}`);
        }
        Singleton._instances.set(className, this);
    }

    /**
     * 获取单例实例
     */
    public static instance<T>(this: new () => T): T {
        const className = this;
        if (!Singleton._instances.has(className)) {
            Singleton._instances.set(className, new (className as any)());
        }
        return Singleton._instances.get(className);
    }

    /**
     * 销毁单例实例
     */
    public static destroyInstance<T>(this: new () => T): void {
        const className = this;
        if (Singleton._instances.has(className)) {
            const instance = Singleton._instances.get(className) as Singleton<T>;
            instance.onDestory();
            Singleton._instances.delete(className);
        }
    }

    /**
     * 检查单例是否存在
     */
    public static hasInstance<T>(this: new () => T): boolean {
        return Singleton._instances.has(this);
    }
    
    /**
     * 销毁回调（可被子类重写）
     */
    protected onDestory(): void {

    }
}