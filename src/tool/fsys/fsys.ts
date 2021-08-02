import * as fs from 'fs';
import * as path from 'path';
import * as fsPromises from 'fs/promises';

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
        this._path = path.resolve(...pathParts);
    }

    /**
     * Gets a promise with the stats of the current element. If the element doesn't
     * exists, throws an error.
     * @returns A Promise with the Stats of the current element.
     */
    stats(): Promise<fs.Stats>;
    stats(opts: fs.StatOptions & { bigint?: false; }): Promise<fs.Stats>;
    stats(opts: fs.StatOptions & { bigint: true; }): Promise<fs.BigIntStats>;
    stats(opts?: fs.StatOptions): Promise<fs.Stats | fs.BigIntStats> {
        return fsPromises.stat(this._path, opts);
    }

    /**
     * Gets the stats of the current element synchronously. If the element doesn't
     * exists, throws an error.
     * @returns The Stats of the current element.
     */
    statsSync(): fs.Stats
    statsSync(bigInt: false): fs.Stats
    statsSync(bigInt: true): fs.BigIntStats
    statsSync(bigInt?: boolean): fs.Stats | fs.BigIntStats {
        return fs.statSync(this._path, { bigint: bigInt });
    }

    /**
     * Checks asynchronously if the current element exists or not.
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

    /**
     * Checks synchronously if the current element exists or not.
     * @returns A boolean indicating if the element exists or not.
     */
    existsSync(): boolean {
        try {
            this.statsSync();
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
    abstract deleteSync(): void;

    abstract copy(...pathParts: string[]): Promise<FSys>;
    abstract copySync(...pathParts: string[]): FSys;

    abstract move(...pathParts: string[]): Promise<void>;
    abstract moveSync(...pathParts: string[]): void;

    async rename(name: string): Promise<void> {
        if (await this.exists()) {
            return this.move(this.path, '..', name);
        } else {
            this._path = this._path.replace(/[^\\\/]+$/gi, name);
        }
    }
}
