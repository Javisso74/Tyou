import {Module} from "../Module";
import {StorageEx} from "./StorageEx";

export class StorageModule extends Module{
    private _storage: StorageEx;
    constructor() {
        super();
        this._storage = new StorageEx();
    }
    onCreate(): void {

    }

    onDestroy(): void {
    }
    
    get ex(): StorageEx {
        return this._storage;
    }

    set(key: string, value: unknown): boolean {
        return this._storage.set(key, value);
    }

    get(key: string): any {
        return this._storage.get(key);
    }

    remove(key: string): boolean {
        return this._storage.remove(key);
    }

    clear(): boolean {
        return this._storage.clear();
    }
}
