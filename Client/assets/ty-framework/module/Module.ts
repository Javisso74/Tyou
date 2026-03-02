
export abstract class Module {
    abstract onCreate(): void;

    public onUpdate(dt: number): void{
        
    }

    abstract onDestroy(): void;

    get log(): Function {
        return (...args: any[]) => {
            Log.info(...args);
        };
    }

    get error(): Function {
        return (...args: any[]) => {
            Log.error(...args);
        };
    }
}