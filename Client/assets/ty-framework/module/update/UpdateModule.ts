import {Module} from "../Module";

/**
 * 更新回调接口
 */
interface UpdateCallback {
    target: any;
    callback: (dt: number) => void;
}


export class UpdateModule extends Module {
    // 存储所有更新回调
    private _updateCallbacks: Map<any, UpdateCallback> = new Map();
    // 用于批量执行时避免修改影响遍历
    private _pendingRemovals: Set<any> = new Set();
    private _isUpdating: boolean = false;

    constructor() {
        super();
        this._updateCallbacks.clear();
        this._pendingRemovals.clear();
        this._isUpdating = false;
    }
    
    /**
     * 初始化模块
     */
    public onCreate(): void {

    }

    /**
     * 更新所有注册的回调
     * @param dt 增量时间
     */
    public onUpdate(dt: number): void {
        this._isUpdating = true;

        // 执行所有更新回调
        this._updateCallbacks.forEach((updateCallback, target) => {
            // 检查是否在待移除列表中
            if (this._pendingRemovals.has(target)) {
                return;
            }

            try {
                updateCallback.callback.call(updateCallback.target, dt);
            } catch (error) {
                console.error(`tyUpdate: Error in update callback for target:`, target, error);
            }
        });

        this._isUpdating = false;

        // 处理待移除的回调
        if (this._pendingRemovals.size > 0) {
            this._pendingRemovals.forEach(target => {
                this._updateCallbacks.delete(target);
            });
            this._pendingRemovals.clear();
        }
    }

    /**
     * 销毁模块
     */
    public onDestroy(): void {
        this._updateCallbacks.clear();
        this._pendingRemovals.clear();
    }

    /**
     * 添加更新回调
     * @param target 回调的目标对象（通常是this）
     * @param callback 更新回调函数
     */
    public addUpdate(target: any, callback: (dt: number) => void): void {
        if (!target || !callback) {
            console.warn("tyUpdate: addUpdate called with invalid parameters");
            return;
        }

        // 检查是否已存在
        if (this._updateCallbacks.has(target)) {
            console.warn(`tyUpdate: Target already has an update callback, will be replaced`, target);
        }

        this._updateCallbacks.set(target, {
            target: target,
            callback: callback
        });

        // 如果该目标在待移除列表中，从列表中移除
        if (this._pendingRemovals.has(target)) {
            this._pendingRemovals.delete(target);
        }
    }

    /**
     * 移除更新回调
     * @param target 回调的目标对象
     */
    public removeUpdate(target: any): void {
        if (!target) {
            return;
        }

        if (this._isUpdating) {
            // 如果在更新过程中，先标记为待移除
            this._pendingRemovals.add(target);
        } else {
            // 直接移除
            this._updateCallbacks.delete(target);
        }
    }

    /**
     * 检查目标是否已注册更新回调
     * @param target 目标对象
     */
    public hasUpdate(target: any): boolean {
        if (this._pendingRemovals.has(target)) {
            return false;
        }
        return this._updateCallbacks.has(target);
    }

    /**
     * 获取已注册的更新回调数量
     */
    public getUpdateCount(): number {
        return this._updateCallbacks.size - this._pendingRemovals.size;
    }

    /**
     * 清空所有更新回调
     */
    public clearAll(): void {
        if (this._isUpdating) {
            // 如果在更新过程中，将所有当前的回调标记为待移除
            this._updateCallbacks.forEach((_, target) => {
                this._pendingRemovals.add(target);
            });
        } else {
            this._updateCallbacks.clear();
        }
        this._pendingRemovals.clear();
    }
}