import {EventTarget} from "cc";
import {Module} from "../Module";

/** 事件监听器信息 */
interface EventListenerInfo {
    callback: Function;
    target: any;
    priority: number;
    once: boolean;
}

/** 事件优先级 */
export enum EventPriority {
    LOWEST = 0,
    LOW = 25,
    NORMAL = 50,
    HIGH = 75,
    HIGHEST = 100
}

/**
 * 事件模块 - 增强的事件系统
 * 
 * 基础用法（保持与原有API兼容）:
 * @example
 * tyou.event.on("eventName", callback, this);
 * tyou.event.emit("eventName", arg1, arg2);
 * tyou.event.off("eventName", callback, this);
 * 
 * 新增功能:
 * @example
 * // 带优先级的监听（数值越大越先执行）
 * tyou.event.onWithPriority("eventName", callback, this, EventPriority.HIGH);
 * 
 * // 异步等待事件
 * const result = await tyou.event.waitFor("eventName", 5000);
 * 
 * // 批量注册/注销
 * const bindId = tyou.event.bindEvents(this, {
 *     "event1": this.onEvent1,
 *     "event2": this.onEvent2
 * });
 * tyou.event.unbindEvents(bindId);
 */
export class EventModule extends Module {
    // 基础事件目标（用于兼容原有API）
    private readonly _eventTarget: EventTarget = new EventTarget();
    
    // 优先级事件存储
    private _priorityListeners: Map<string, EventListenerInfo[]> = new Map();
    
    // 批量绑定管理
    private _bindIdCounter: number = 0;
    private _bindingMap: Map<number, { target: any; events: string[] }> = new Map();

    /**
     * 初始化模块
     */
    public onCreate(): void {
    }

    /**
     * 销毁模块
     */
    public onDestroy(): void {
        this._priorityListeners.clear();
        this._bindingMap.clear();
    }

    /**
     * 检查指定事件是否已注册回调
     * @param type 事件类型
     * @param callback 回调函数
     * @param target 回调目标
     */
    public hasEventListener(type: string, callback?: (...args: any[]) => void, target?: any): boolean {
        // 先检查优先级列表
        const listeners = this._priorityListeners.get(type);
        if (listeners && listeners.length > 0) {
            if (!callback) return true;
            return listeners.some(info => 
                info.callback === callback && (target === undefined || info.target === target)
            );
        }
        // 再检查基础EventTarget
        return this._eventTarget.hasEventListener(type, callback, target);
    }

    /**
     * 注册事件监听（兼容原有API）
     * @param type 事件类型
     * @param callback 回调函数
     * @param target 回调目标
     * @returns 回调函数本身，可用于取消监听
     */
    public on<T extends (...args: any[]) => void>(type: string, callback: T, target?: any): T {
        return this._eventTarget.on(type, callback, target);
    }

    /**
     * 注册带优先级的事件监听
     * @param type 事件类型
     * @param callback 回调函数
     * @param target 回调目标
     * @param priority 优先级（数值越大越先执行，默认 NORMAL=50）
     * @returns 回调函数本身
     */
    public onWithPriority<T extends (...args: any[]) => void>(
        type: string, 
        callback: T, 
        target?: any, 
        priority: number = EventPriority.NORMAL
    ): T {
        let listeners = this._priorityListeners.get(type);
        if (!listeners) {
            listeners = [];
            this._priorityListeners.set(type, listeners);
        }

        // 检查是否已存在
        const exists = listeners.some(info => 
            info.callback === callback && info.target === target
        );
        if (exists) return callback;

        // 按优先级插入（降序，优先级高的在前）
        const info: EventListenerInfo = { callback, target, priority, once: false };
        let inserted = false;
        for (let i = 0; i < listeners.length; i++) {
            if (priority > listeners[i].priority) {
                listeners.splice(i, 0, info);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            listeners.push(info);
        }

        return callback;
    }

    /**
     * 注册一次性事件监听（兼容原有API）
     * @param type 事件类型
     * @param callback 回调函数
     * @param target 回调目标
     * @returns 回调函数本身，可用于取消监听
     */
    public once<T extends (...args: any[]) => void>(type: string, callback: T, target?: any): T {
        return this._eventTarget.once(type, callback, target);
    }

    /**
     * 注册带优先级的一次性事件监听
     * @param type 事件类型
     * @param callback 回调函数
     * @param target 回调目标
     * @param priority 优先级
     */
    public onceWithPriority<T extends (...args: any[]) => void>(
        type: string, 
        callback: T, 
        target?: any, 
        priority: number = EventPriority.NORMAL
    ): T {
        let listeners = this._priorityListeners.get(type);
        if (!listeners) {
            listeners = [];
            this._priorityListeners.set(type, listeners);
        }

        const info: EventListenerInfo = { callback, target, priority, once: true };
        
        // 按优先级插入
        let inserted = false;
        for (let i = 0; i < listeners.length; i++) {
            if (priority > listeners[i].priority) {
                listeners.splice(i, 0, info);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            listeners.push(info);
        }

        return callback;
    }

    /**
     * 取消事件监听（兼容原有API）
     * @param type 事件类型
     * @param callback 回调函数
     * @param target 回调目标
     */
    public off<T extends (...args: any[]) => void>(type: string, callback?: T, target?: any): void {
        // 从优先级列表移除
        const listeners = this._priorityListeners.get(type);
        if (listeners) {
            for (let i = listeners.length - 1; i >= 0; i--) {
                const info = listeners[i];
                if (!callback || (info.callback === callback && (target === undefined || info.target === target))) {
                    listeners.splice(i, 1);
                }
            }
        }
        // 从基础EventTarget移除
        this._eventTarget.off(type, callback, target);
    }

    /**
     * 移除指定目标的所有事件监听
     * @param typeOrTarget 事件类型或目标
     */
    public targetOff(typeOrTarget: any): void {
        // 从优先级列表移除
        if (typeof typeOrTarget === 'string') {
            this._priorityListeners.delete(typeOrTarget);
        } else {
            for (const [type, listeners] of this._priorityListeners) {
                for (let i = listeners.length - 1; i >= 0; i--) {
                    if (listeners[i].target === typeOrTarget) {
                        listeners.splice(i, 1);
                    }
                }
            }
        }
        this._eventTarget.targetOff(typeOrTarget);
    }

    /**
     * 移除特定事件类型或目标的所有回调
     * @param typeOrTarget 事件类型或目标
     */
    public removeAll(typeOrTarget: any): void {
        if (typeof typeOrTarget === 'string') {
            this._priorityListeners.delete(typeOrTarget);
        } else {
            for (const [type, listeners] of this._priorityListeners) {
                for (let i = listeners.length - 1; i >= 0; i--) {
                    if (listeners[i].target === typeOrTarget) {
                        listeners.splice(i, 1);
                    }
                }
            }
        }
        this._eventTarget.removeAll(typeOrTarget);
    }

    /**
     * 触发事件（兼容原有API）
     * @param type 事件类型
     * @param arg0 参数0
     * @param arg1 参数1
     * @param arg2 参数2
     * @param arg3 参数3
     * @param arg4 参数4
     */
    public emit(type: string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void {
        // 先执行优先级监听器（高优先级先执行）
        const listeners = this._priorityListeners.get(type);
        if (listeners && listeners.length > 0) {
            // 复制列表防止遍历时修改
            const copy = listeners.slice();
            const toRemove: number[] = [];

            for (let i = 0; i < copy.length; i++) {
                const info = copy[i];
                try {
                    if (info.target) {
                        info.callback.call(info.target, arg0, arg1, arg2, arg3, arg4);
                    } else {
                        (info.callback as Function)(arg0, arg1, arg2, arg3, arg4);
                    }
                } catch (e) {
                    console.error(`[EventModule] Error in event "${type}":`, e);
                }

                if (info.once) {
                    toRemove.push(i);
                }
            }

            // 移除once监听器
            for (let i = toRemove.length - 1; i >= 0; i--) {
                const idx = listeners.findIndex(l => l === copy[toRemove[i]]);
                if (idx !== -1) {
                    listeners.splice(idx, 1);
                }
            }
        }

        // 再执行基础EventTarget的监听器
        this._eventTarget.emit(type, arg0, arg1, arg2, arg3, arg4);
    }

    /**
     * 异步等待事件触发
     * @param type 事件类型
     * @param timeout 超时时间（毫秒），0表示不超时
     * @returns Promise，resolve时返回事件参数数组，超时返回null
     * @example
     * const args = await tyou.event.waitFor("dataLoaded", 5000);
     * if (args) {
     *     console.log("收到事件", args[0], args[1]);
     * } else {
     *     console.log("超时");
     * }
     */
    public waitFor(type: string, timeout: number = 0): Promise<any[] | null> {
        return new Promise((resolve) => {
            let timeoutId: number = 0;
            let resolved = false;

            const callback = (...args: any[]) => {
                if (resolved) return;
                resolved = true;
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                resolve(args);
            };

            this._eventTarget.once(type, callback);

            if (timeout > 0) {
                timeoutId = setTimeout(() => {
                    if (resolved) return;
                    resolved = true;
                    this._eventTarget.off(type, callback);
                    resolve(null);
                }, timeout) as unknown as number;
            }
        });
    }

    /**
     * 批量注册事件（便捷方法）
     * @param target 目标对象
     * @param events 事件映射表 { eventName: callback }
     * @returns 绑定ID，用于批量注销
     * @example
     * const bindId = tyou.event.bindEvents(this, {
     *     "playerDie": this.onPlayerDie,
     *     "gameOver": this.onGameOver
     * });
     * // 稍后注销
     * tyou.event.unbindEvents(bindId);
     */
    public bindEvents(target: any, events: { [eventName: string]: Function }): number {
        const bindId = ++this._bindIdCounter;
        const eventNames: string[] = [];

        for (const [eventName, callback] of Object.entries(events)) {
            this._eventTarget.on(eventName, callback as any, target);
            eventNames.push(eventName);
        }

        this._bindingMap.set(bindId, { target, events: eventNames });
        return bindId;
    }

    /**
     * 批量注销事件
     * @param bindId 绑定ID
     */
    public unbindEvents(bindId: number): void {
        const binding = this._bindingMap.get(bindId);
        if (!binding) return;

        for (const eventName of binding.events) {
            this._eventTarget.off(eventName, undefined, binding.target);
        }

        this._bindingMap.delete(bindId);
    }

    /**
     * 获取某个事件的监听器数量
     * @param type 事件类型
     */
    public getListenerCount(type: string): number {
        let count = 0;
        const listeners = this._priorityListeners.get(type);
        if (listeners) {
            count += listeners.length;
        }
        // EventTarget没有提供获取数量的方法，这里只返回优先级监听器的数量
        return count;
    }
}