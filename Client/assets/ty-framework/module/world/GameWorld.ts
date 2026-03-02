import {Component} from "cc";
import {GameEvent} from "../../core/GameEvent";

const TIMESTAMP_EPOCH_2025 = new Date('2025-01-01T00:00:00Z').getTime() / 1000; // 2025年1月1日的Unix时间戳（秒）
export class GameWorld extends Component {

    /** 服务器时间与本地时间同步 */
    private _serverTime: number = 0;
    private _timeScale: number = 1;

    private _dayTimezoneOffsetMinutes: number = 480;
    private _dayResetHour: number = 0;
    private _autoSaveIntervalSeconds: number = 5;
    private _autoSaveCount: number = 0;
    private _stamRecoverCount: number = 0;
    
    protected start(): void {
        this.setServerTime(Date.now());
        this.schedule(() => {
            this._serverTime ++;
            this._autoSaveCount++;
            this._stamRecoverCount++;
            if (this._stamRecoverCount >= 60) {
                this._stamRecoverCount = 0;
            }
            tyou.event.emit(GameEvent.TIME_UPDATE_SECOND);
            if (this._autoSaveCount >= this._autoSaveIntervalSeconds) {
                this._autoSaveCount = 0;
            }
        }, 1)
    }

    setServerTime(val: number) {
        this._serverTime = this.now(val);
    }

    getServerTime(): number {
        return this._serverTime;
    }

    setTimeScale(scale: number) {
        this._timeScale = scale;
    }

    getTimeScale(): number {
        return this._timeScale;
    }

    //当前真实时间戳
    ts2now(ts: number): number {
        return Math.floor((ts + TIMESTAMP_EPOCH_2025) * 1000);
    }
    //储存时间戳
    ts(): number {
        const t = this._serverTime;
        return t - TIMESTAMP_EPOCH_2025;
    }


    private now(tick: number): number {
        return Math.floor(tick / 1000);
    }

    //setDayBoundary(480, 5) 默认是0  如果凌晨5点就这么设置
    setDayBoundary(timezoneOffsetMinutes: number = 480, resetHour: number = 0): void {
        this._dayTimezoneOffsetMinutes = Math.floor(timezoneOffsetMinutes || 0);
        this._dayResetHour = Math.max(0, Math.min(23, Math.floor(resetHour || 0)));
    }

    checkIsSameDay(ts: number, nowTs?: number): boolean {
        const a = this.ts2unixSeconds(ts);
        const b = this.ts2unixSeconds(nowTs ?? this.ts());
        return this._getDayKeyByUnixSeconds(a) === this._getDayKeyByUnixSeconds(b);
    }

    checkIsNewDay(lastTs: number, nowTs?: number): boolean {
        return !this.checkIsSameDay(lastTs, nowTs);
    }

    private _getDayKeyByUnixSeconds(unixSeconds: number): number {
        const adj = Math.floor(unixSeconds) + this._dayTimezoneOffsetMinutes * 60 - this._dayResetHour * 3600;
        const d = new Date(adj * 1000);
        const y = d.getUTCFullYear();
        const m = d.getUTCMonth() + 1;
        const day = d.getUTCDate();
        return y * 10000 + m * 100 + day;
    }

    private ts2unixSeconds(ts: number): number {
        return (Math.floor(ts || 0) + TIMESTAMP_EPOCH_2025);
    }
    
}
