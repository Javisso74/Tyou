import {_decorator, Asset, Component} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('ResourceHolder')
export class ResourceHolder extends Component {
    private asset: Asset;

    public init(asset: Asset): void {
        this.asset = asset;
    }
    override onDestroy() {
        tyou.res.decRef(this.asset);
        this.asset = null;
    }
}