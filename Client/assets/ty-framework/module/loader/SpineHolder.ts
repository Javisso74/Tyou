import {_decorator, Asset, Component, sp} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('SpineHolder')
export class SpineHolder extends Component {
    private spine!: sp.Skeleton;
    private asset: Asset;
    private isAutoPlay:boolean;
    private isDestory:boolean;
    private isLoop:boolean;

    public init(spine: sp.Skeleton,asset:Asset,isAutoPlay = true,isDestory = true,isLoop = false): void {
        this.spine = spine;
        this.asset = asset;
        this.isAutoPlay = isAutoPlay;
        this.isDestory = isDestory;
        this.spine.setCompleteListener(this.onSpineComplete.bind(this));
        if (isAutoPlay) {
            this.spine.setAnimation(0, "animation", isLoop);
        }
    }
    
    private onSpineComplete() {
        tyou.res.decRef(this.asset);
        this.asset = null;
        if (this.isDestory) {
            this.node.destroy();
        }
    }
}