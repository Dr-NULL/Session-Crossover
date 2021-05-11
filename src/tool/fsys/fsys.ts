import * as fsModule from 'fs';
import * as pathModule from 'path';
import * as Wrapper from './fs-wrappers';

export abstract class FSys {
    protected _path: string;
    /**
     * Gets the absolute path of the current element.
     */
    public get path(): string {
        return this._path;
    }

    /**
     * Gets thhe name of the element.
     */
    public get name(): string {
        const match = this._path.match(/[^\\\/]+$/gi);
        if (match) {
            return match[0];
        } else {
            throw new Error('NONAME: The current element doesn\'t have a valid path');
        }
    }

    /**
     * Create a new instance.
     * @param pathParts parts of the element path, these will be resolved relative to cwd.
     */
    constructor(...pathParts: string[]) {
        this._path = pathModule.resolve(...pathParts);
    }

    /**
     * Gets a promise with the stats of the current element. If the element doesn't
     * exists, throws an error.
     * @returns A Promise with the Stats of the current element.
     */
    stats(): Promise<fsModule.Stats>
    stats(bigInt: false): Promise<fsModule.Stats>
    stats(bigInt: true): Promise<fsModule.BigIntStats>
    stats(bigInt?: boolean): Promise<fsModule.Stats | fsModule.BigIntStats> {
        return Wrapper.stats(this._path, bigInt);
    }

    /**
     * Checks if the current element exists or not.
     * @returns A boolean indicating if the element exists or not.
     */
    async exists(): Promise<boolean> {
        try {
            await this.stats();
            return true;
        } catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            } else {
                throw err;
            }
        }
    }

    abstract delete(): Promise<void>;
    abstract copy(...pathParts: string[]): Promise<FSys>; 
    abstract move(...pathParts: string[]): Promise<void>;

    async rename(name: string): Promise<void> {
        return this.move(this.path, '..', name);
    }
}
