import {Vec3, Node, UIOpacity, UITransform, sp} from "cc";
import {MoveTo} from "../animator-move/MoveTo";
import {ScaleTo} from "../animator-move/ScaleTo";
import {OpacityTo} from "../animator-move/OpacityTo";
import {EasingType} from "../EasingType";


export class GameUtil {
    static async moveTo(from: Node, to: Vec3 | Node, speed: number, easing: EasingType = EasingType.LINEAR, ns = Node.NodeSpace.LOCAL) {
        let isFinished = false;
        if (from.getComponent(MoveTo)) {
            from.getComponent(MoveTo).exit();
            await Unitask.waitNextFrame();
        }
        const moveTo = from.addComponent(MoveTo)!;
        moveTo.speed = speed;
        moveTo.target = to;
        moveTo.easing = easing;
        moveTo.ns = ns;
        moveTo.onComplete = () => {
            isFinished = true;
        };
        await Unitask.waitUntil(() => isFinished);
    }

    static async scaleTo(from: Node, to: number, speed: number, easing: EasingType = EasingType.LINEAR) {
        let isFinished = false;
        const scaleTo = from.addComponent(ScaleTo)!;
        scaleTo.speed = speed;
        scaleTo.target = to;
        scaleTo.easing = easing;
        scaleTo.onComplete = () => {
            isFinished = true;
        };
        await Unitask.waitUntil(() => isFinished);
    }

    static async opacityTo(node: Node, from: number, to: number, speed: number, easing: EasingType = EasingType.LINEAR) {
        let uiOpacity = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        uiOpacity.opacity = from;
        let isFinished = false;
        const opacityTo = node.addComponent(OpacityTo)!;
        opacityTo.speed = speed;
        opacityTo.easing = easing;
        opacityTo.target = to;
        opacityTo.onComplete = () => {
            isFinished = true;
        };
        await Unitask.waitUntil(() => isFinished);
    }

    static getLocalPositionFromN2N(form: Node, to: Node) {
        const worldPos = form.getWorldPosition();
        const toTransform = to.getComponent(UITransform);
        const nodePos = toTransform.convertToNodeSpaceAR(worldPos);
        return nodePos;
    }

    static playSpineSample(node: Node, cb: Function) {
        const spine = node.getComponent(sp.Skeleton) || node.getComponentInChildren(sp.Skeleton);
        spine.setAnimation(0, "animation", false);
        spine.setCompleteListener(() => {
            cb?.();
        });
    }

    static direction2degrees(direction: { x: number, y: number }): number {
        return (Math.atan2(direction.y, direction.x) - Math.PI / 2) * (180 / Math.PI);
    }

}