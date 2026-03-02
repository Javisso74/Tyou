import {find, Label} from "cc";
import {EasingType} from "../../core/EasingType";
import {GameUtil} from "../../core/util/GameUtil";
import {NodePool} from "../pool/NodePool";
import {UILayer} from "./WindowAttribute";

export class TipManager {
    private _pool: NodePool;
    private _windowLayer = UILayer.Tips;
    private _queue: string[] = [];
    private _interval: number = 0.3;
    private _cooldown: number = 0;

    async onCreate() {
        this._pool = await tyou.pool.getOrCreateNodePool({
                assetPath: "TipUI",
                preloadCount: 1,
            }
        );
    }

    onUpdate(dt: number): void {
        if (this._queue.length === 0) {
            return;
        }
        if (this._cooldown > 0) {
            this._cooldown -= dt;
            if (this._cooldown > 0) {
                return;
            }
        }
        this._spawnNext();
    }

    onDestroy() {
        this._pool?.destroy();
    }

    async showTip(msg: string) {
        this._queue.push(msg);
        if (this._cooldown <= 0 && this._queue.length === 1) {
            this._spawnNext();
        }
    }

    private _spawnNext(): void {
        if (this._queue.length === 0) {
            return;
        }
        const msg = this._queue.shift();
        if (!msg) {
            return;
        }
        this._cooldown = this._interval;
        this._playTip(msg).then();
    }

    private async _playTip(msg: string) {
        const tip = await this._pool.getAsync();
        tip.setPosition(0, 0);
        find("m_textTip", tip).getComponent(Label).string = msg;
        tip.parent = tyou.ui.getLayerNode(this._windowLayer);
        let v3 = tyou.pool.getVec3();
        v3.set(tip.position.x, tip.position.y + 200, 0);
        let promissList = [];
        promissList.push(GameUtil.moveTo(tip, v3, 200));
        promissList.push(GameUtil.opacityTo(tip, 255, 0, 250, EasingType.EASE_IN));
        await Promise.all(promissList);
        tyou.pool.releaseVec3(v3);
        this._pool.release(tip);
    }
}


