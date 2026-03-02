import { Asset, isValid } from 'cc';

export enum SceneEnum {
    Login = "login",
    Game = "game"
}

export class SceneBase {
    protected _sceneName: string = '';
    protected _sceneAsset: Asset;
    protected _dynamicsAssets: Asset[] = [];

    constructor(sceneName: string) {
        this._sceneName = sceneName;
    }

    public onInit(sceneAsset: Asset): void {
        this._sceneAsset = sceneAsset;
    }

    public onEnter(data?: any): void {
        // 场景进入逻辑
    }

    public onLeave(): void {
        this._dynamicsAssets.forEach((asset: Asset) => {
            tyou.res.decRef(asset);
        });
        this._dynamicsAssets = [];
    }

    public get sceneName(): string {
        return this._sceneName;
    }

    public get sceneAsset(): Asset {
        return this._sceneAsset;
    }

    public addAutoReleaseAsset(asset: Asset): void {
        if (isValid(asset)) {
            this._dynamicsAssets.push(asset);
        }
    }
}

export class LoginScene extends SceneBase {
    // 登录场景特定逻辑
}

export class GameScene extends SceneBase {
    // 游戏场景特定逻辑
}