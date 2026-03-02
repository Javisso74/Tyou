import {UITransform, Node} from "cc";
import {ViewUtil} from "../../../ty-framework/core/util/ViewUtil";

export interface ISystem {
    onCreate(): void;

    onRelease(): void;
}

export abstract class ManagerBase implements ISystem {
    abstract onCreate(): void;

    onUpdate(dt: number): void {

    }

    abstract onRelease(): void;
}


export abstract class UnitBase implements ISystem {
    private _node: Node;
    transform: UITransform;

    get node(): Node {
        return this._node;
    }

    set node(node: Node) {
        this._node = node;
        this.transform = node.getComponent(UITransform)!;
    }

    get(name): Node {
        return ViewUtil.findNode(this._node, name);
    }

    abstract onCreate(): void;

    onUpdate(dt: number): void {

    }

    abstract onRelease(): void;
}


