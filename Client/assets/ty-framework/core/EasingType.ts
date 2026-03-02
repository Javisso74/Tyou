// EasingType.ts
export enum EasingType {
    LINEAR = 'linear',      // 线性
    EASE_IN = 'easeIn',     // 先慢后快
    EASE_OUT = 'easeOut'    // 先快后慢
}

// 缓动函数实现
export class EasingFunctions {
    static linear(t: number): number {
        return t;
    }

    static easeIn(t: number): number {
        return t * t;
    }

    static easeOut(t: number): number {
        return t * (2 - t);
    }

    static getEasingFunction(type: EasingType): (t: number) => number {
        switch (type) {
            case EasingType.EASE_IN:
                return this.easeIn;
            case EasingType.EASE_OUT:
                return this.easeOut;
            case EasingType.LINEAR:
            default:
                return this.linear;
        }
    }
}