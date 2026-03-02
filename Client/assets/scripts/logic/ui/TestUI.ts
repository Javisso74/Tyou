import {Label, Layout, Node, Sprite} from "cc";
import {SceneEnum} from "../../../ty-framework/module/scene/Scene";
import {UIWindow} from "../../../ty-framework/module/ui/UIWindow";
import {IWindowAttribute, UILayer} from "../../../ty-framework/module/ui/WindowAttribute";

export class TestUI extends UIWindow {
    //#region UI组件引用
    private _btnEnter: Node;

    static get WINDOW_NAME(): string {
        return "TestUI";
    }

    override bindMemberProperty() {
        this._btnEnter = this.get("m_btnEnter");
    }

    override registerEvent() {
        this.onRegisterEvent(this._btnEnter, this.onBtnEnterClick)
    }

    //#endregion

    private async onBtnEnterClick(btn: Node, param: any) {
        this.close();
        tyou.scene.loadSceneAsync(SceneEnum.Game);
    }

    protected get customAttributeOverride(): Partial<IWindowAttribute> {
        return {
            layer: UILayer.Tips,
            fullScreen: false,
            bgClose: true,
        };
    }

    override async onCreate() {

    }

    override onRefresh() {

    }

    override onClosed() {

    }
}
