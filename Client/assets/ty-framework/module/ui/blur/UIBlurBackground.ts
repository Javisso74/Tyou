import {Button, find, Node} from "cc";
import {UIWindow} from "../UIWindow";

export class UIBlurBackground {
    private _uiRoot: Node | null = null;
    private _node: Node | null = null;
    private _currentWindowNode: Node | null = null;
    private _onClick: (() => void) | null = null;

    init(uiRoot: Node) {
        this._uiRoot = uiRoot;
        this.ensureNode();
    }

    public setOnClick(handler: (() => void) | null): void {
        this._onClick = handler;
    }

    async showBehindWindow(window: UIWindow): Promise<void> {
        if (!window || !window.node || !window.node.isValid) {
            this.hide();
            return;
        }

        if (!this._uiRoot || !this._uiRoot.isValid) {
            this.hide();
            return;
        }

        this.ensureNode();
        if (!this._node || !this._node.isValid) {
            return;
        }

        const parent = window.node.parent;
        if (!parent || !parent.isValid) {
            this.hide();
            return;
        }

        if (this._node.parent !== parent) {
            this._node.setParent(parent);
        }

        const windowIndex = window.node.getSiblingIndex();
        const sameParent = this._node.parent === parent;
        const bgIndex = this._node.getSiblingIndex();
        const targetIndex = sameParent ? (bgIndex < windowIndex ? Math.max(0, windowIndex - 1) : Math.max(0, windowIndex)) : Math.max(0, windowIndex);
        if (this._node.getSiblingIndex() !== targetIndex) {
            this._node.setSiblingIndex(targetIndex);
        }

        if (!this._node.active) {
            this._node.active = true;
        }

        this._currentWindowNode = window.node;
    }

    hide(): void {
        if (this._node && this._node.isValid) {
            this._node.active = false;
        }
        this._currentWindowNode = null;
    }

    destroy(): void {
        this.hide();
        if (this._node && this._node.isValid) {
            this._node.off("click", this._handleClick, this);
        }
        this._node = null;
        this._uiRoot = null;
    }

    private ensureNode(): void {
        if (this._node && this._node.isValid) {
            return;
        }
        if (!this._uiRoot || !this._uiRoot.isValid) {
            return;
        }
        const node = find("BlurBg", this._uiRoot) as Node;
        if (!node || !node.isValid) {
            return;
        }
        this._node = node;
        this._node.active = false;
        const btn = this._node.getComponent(Button);
        if (btn) {
            this._node.off("click", this._handleClick, this);
            this._node.on("click", this._handleClick, this);
        }
    }

    private _handleClick(): void {
        this._onClick?.();
    }
}
