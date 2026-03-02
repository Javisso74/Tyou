export interface IGameSystem {
    onCreate(): void;
    onRelease(): void;
}

export abstract class GameSystemBase implements IGameSystem {
    abstract onCreate(): void;

    protected onUpdate(dt: number): void {

    }

    abstract onRelease(): void ;

}
