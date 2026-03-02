import {_decorator, Component} from 'cc';
import {Module} from "../Module";

const {ccclass, property} = _decorator;

// 计时器回调类型
export type TimerHandler = (args?: any[]) => void;

class Timer {
    public id: number = 0;
    public currentTime: number = 0;
    public totalTime: number = 0;
    public handler: TimerHandler;
    public isLoop: boolean = false;
    public isNeedRemove: boolean = false;
    public isRunning: boolean = false;
    public args: any[] = [];
    public heapIndex: number = -1; // 在堆中的索引，用于快速定位

    constructor() {
        this.handler = () => {
        };
    }

    /** 重置Timer对象用于复用 */
    public reset(): void {
        this.id = 0;
        this.currentTime = 0;
        this.totalTime = 0;
        this.handler = () => {
        };
        this.isLoop = false;
        this.isNeedRemove = false;
        this.isRunning = false;
        this.args.length = 0;
        this.heapIndex = -1;
    }
}

/**
 * 最小堆实现，用于高效管理定时器
 * 时间复杂度：插入 O(log n)，删除 O(log n)，取最小 O(1)
 */
class TimerHeap {
    private _heap: Timer[] = [];
    private _size: number = 0;

    public get size(): number {
        return this._size;
    }

    /** 插入定时器 */
    public push(timer: Timer): void {
        timer.heapIndex = this._size;
        this._heap[this._size] = timer;
        this._size++;
        this._siftUp(timer.heapIndex);
    }

    /** 获取堆顶（最小时间）定时器，不移除 */
    public peek(): Timer | null {
        return this._size > 0 ? this._heap[0] : null;
    }

    /** 弹出堆顶定时器 */
    public pop(): Timer | null {
        if (this._size === 0) return null;

        const result = this._heap[0];
        result.heapIndex = -1;
        this._size--;

        if (this._size > 0) {
            const last = this._heap[this._size];
            this._heap[0] = last;
            last.heapIndex = 0;
            this._siftDown(0);
        }

        return result;
    }

    /** 更新指定定时器的位置（当currentTime改变时调用） */
    public update(timer: Timer): void {
        if (timer.heapIndex < 0 || timer.heapIndex >= this._size) return;

        const index = timer.heapIndex;
        // 先尝试上浮，再尝试下沉
        this._siftUp(index);
        this._siftDown(timer.heapIndex);
    }

    /** 移除指定定时器 */
    public remove(timer: Timer): boolean {
        const index = timer.heapIndex;
        if (index < 0 || index >= this._size) return false;

        timer.heapIndex = -1;
        this._size--;

        if (index === this._size) {
            // 移除的是最后一个，直接返回
            return true;
        }

        // 用最后一个元素替换被删除的元素
        const last = this._heap[this._size];
        this._heap[index] = last;
        last.heapIndex = index;

        // 调整堆
        this._siftUp(index);
        this._siftDown(last.heapIndex);

        return true;
    }

    /** 清空堆 */
    public clear(): void {
        for (let i = 0; i < this._size; i++) {
            this._heap[i].heapIndex = -1;
        }
        this._size = 0;
    }

    /** 遍历所有定时器 */
    public forEach(callback: (timer: Timer) => void): void {
        for (let i = 0; i < this._size; i++) {
            callback(this._heap[i]);
        }
    }

    /** 上浮操作 */
    private _siftUp(index: number): void {
        const timer = this._heap[index];
        while (index > 0) {
            const parentIndex = (index - 1) >> 1;
            const parent = this._heap[parentIndex];

            if (timer.currentTime >= parent.currentTime) break;

            this._heap[index] = parent;
            parent.heapIndex = index;
            index = parentIndex;
        }

        this._heap[index] = timer;
        timer.heapIndex = index;
    }

    /** 下沉操作 */
    private _siftDown(index: number): void {
        const timer = this._heap[index];
        const halfSize = this._size >> 1;

        while (index < halfSize) {
            let minChildIndex = (index << 1) + 1;
            let minChild = this._heap[minChildIndex];
            const rightIndex = minChildIndex + 1;

            if (rightIndex < this._size && this._heap[rightIndex].currentTime < minChild.currentTime) {
                minChildIndex = rightIndex;
                minChild = this._heap[rightIndex];
            }

            if (timer.currentTime <= minChild.currentTime) break;

            this._heap[index] = minChild;
            minChild.heapIndex = index;
            index = minChildIndex;
        }

        this._heap[index] = timer;
        timer.heapIndex = index;
    }
}

@ccclass('TimerModule')
export class TimerModule extends Module {
    onCreate(): void {
    }

    onDestroy(): void {
        this.removeAllTimer();
    }

    private _currentTimerId: number = 0;
    private _timerHeap: TimerHeap = new TimerHeap();
    private _timerMap: Map<number, Timer> = new Map(); // id -> Timer 快速查找
    private _timerPool: Timer[] = []; // Timer对象池
    private _pendingRemove: Timer[] = []; // 待删除列表

    /** 从对象池获取或创建Timer */
    private _createTimer(): Timer {
        return this._timerPool.pop() || new Timer();
    }

    /** 回收Timer到对象池 */
    private _recycleTimer(timer: Timer): void {
        timer.reset();
        this._timerPool.push(timer);
    }

    /**
     * 添加计时器
     * @param callback 回调函数
     * @param time 时间间隔（秒）
     * @param isLoop 是否循环
     * @param args 回调参数
     * @returns 计时器ID
     */
    public addTimer(callback: TimerHandler, time: number, isLoop: boolean = false, ...args: any[]): number {
        const timer = this._createTimer();
        timer.id = ++this._currentTimerId;
        timer.currentTime = time;
        timer.totalTime = time;
        timer.handler = callback;
        timer.isLoop = isLoop;
        timer.args = args;
        timer.isNeedRemove = false;
        timer.isRunning = true;

        this._timerHeap.push(timer);
        this._timerMap.set(timer.id, timer);

        return timer.id;
    }

    /**
     * 暂停计时器
     * @param timerId 计时器ID
     */
    public stop(timerId: number): void {
        const timer = this._timerMap.get(timerId);
        if (timer) {
            timer.isRunning = false;
        }
    }

    /**
     * 恢复计时器
     * @param timerId 计时器ID
     */
    public resume(timerId: number): void {
        const timer = this._timerMap.get(timerId);
        if (timer) {
            timer.isRunning = true;
        }
    }

    /**
     * 检查计时器是否正在运行
     * @param timerId 计时器ID
     * @returns 是否运行中
     */
    public isRunning(timerId: number): boolean {
        const timer = this._timerMap.get(timerId);
        return timer !== null && timer !== undefined && timer.isRunning;
    }

    /**
     * 获取计时器剩余时间
     * @param timerId 计时器ID
     * @returns 剩余时间
     */
    public getLeftTime(timerId: number): number {
        const timer = this._timerMap.get(timerId);
        return timer ? timer.currentTime : 0;
    }

    /**
     * 重新开始计时器
     * @param timerId 计时器ID
     */
    public restart(timerId: number): void {
        const timer = this._timerMap.get(timerId);
        if (timer) {
            timer.currentTime = timer.totalTime;
            timer.isRunning = true;
            this._timerHeap.update(timer);
        }
    }

    /**
     * 重置计时器
     * @param timerId 计时器ID
     * @param callback 回调函数
     * @param time 时间间隔
     * @param isLoop 是否循环
     */
    public resetTimer(timerId: number, callback: TimerHandler, time: number, isLoop: boolean = false): void {
        const timer = this._timerMap.get(timerId);
        if (timer) {
            timer.currentTime = time;
            timer.totalTime = time;
            timer.handler = callback;
            timer.isLoop = isLoop;
            timer.isNeedRemove = false;
            this._timerHeap.update(timer);
        }
    }

    /**
     * 重置计时器（不改变回调函数）
     * @param timerId 计时器ID
     * @param time 时间间隔
     * @param isLoop 是否循环
     */
    public resetTimerEx(timerId: number, time: number, isLoop: boolean): void {
        const timer = this._timerMap.get(timerId);
        if (timer) {
            timer.currentTime = time;
            timer.totalTime = time;
            timer.isLoop = isLoop;
            timer.isNeedRemove = false;
            this._timerHeap.update(timer);
        }
    }

    /**
     * 移除计时器
     * @param timerId 计时器ID
     */
    public removeTimer(timerId: number): void {
        const timer = this._timerMap.get(timerId);
        if (timer) {
            timer.isNeedRemove = true;
        }
    }

    /**
     * 移除所有计时器
     */
    public removeAllTimer(): void {
        this._timerHeap.forEach(timer => {
            this._recycleTimer(timer);
        });
        this._timerHeap.clear();
        this._timerMap.clear();
        this._pendingRemove.length = 0;
    }

    /**
     * 获取当前活跃定时器数量
     */
    public getTimerCount(): number {
        return this._timerMap.size;
    }

    /**
     * Component生命周期：更新
     * @param dt 增量时间
     */
    public onUpdate(dt: number): void {
        this._updateTimer(dt);
    }

    /**
     * 更新所有计时器（优化版本）
     * @param elapsedSeconds 经过的秒数
     */
    private _updateTimer(elapsedSeconds: number): void {
        // 清空待删除列表
        this._pendingRemove.length = 0;

        // 更新所有定时器的时间
        this._timerHeap.forEach(timer => {
            if (timer.isNeedRemove) {
                this._pendingRemove.push(timer);
                return;
            }

            if (timer.isRunning) {
                timer.currentTime -= elapsedSeconds;
            }
        });

        // 处理所有到期的定时器
        // 使用迭代而非递归，防止栈溢出
        const maxIterations = 1000; // 安全限制，防止无限循环
        let iterations = 0;

        while (iterations < maxIterations) {
            const top = this._timerHeap.peek();
            if (!top || top.currentTime > 0 || top.isNeedRemove || !top.isRunning) {
                break;
            }

            iterations++;

            // 执行回调
            if (top.handler) {
                try {
                    top.handler(top.args);
                } catch (e) {
                    console.error('[TimerModule] Timer callback error:', e);
                }
            }

            if (top.isLoop && !top.isNeedRemove) {
                // 循环定时器：重置时间并调整堆位置
                top.currentTime += top.totalTime;
                // 确保时间不会是负数（处理坏帧情况）
                if (top.currentTime <= 0) {
                    top.currentTime = top.totalTime;
                }
                this._timerHeap.update(top);
            } else {
                // 单次定时器或已标记删除：加入待删除列表
                this._pendingRemove.push(top);
            }
        }

        if (iterations >= maxIterations) {
            console.warn('[TimerModule] Too many timer callbacks in one frame, possible infinite loop');
        }

        // 批量删除待删除的定时器
        for (const timer of this._pendingRemove) {
            this._timerHeap.remove(timer);
            this._timerMap.delete(timer.id);
            this._recycleTimer(timer);
        }
    }
}


