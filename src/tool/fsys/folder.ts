import * as fs from 'fs';
import * as Wrapper from './fs-wrappers';
import { resolve, join } from 'path';

import { FSys } from './fsys';
import { File } from './file';
import { FolderChildren } from './folder-children';

export class Folder extends FSys {
    constructor(...pathParts: string[]) {
        super(...pathParts);
    }

    /**
     * Creates the folder asynchronously if the path doesn't exists.
     * @returns An empty promise with the pending operation.
     */
    async make(): Promise<void> {
        // Test folder existence
        let fail = false;
        try {
            await this.stats();
        } catch (err) {
            fail = true;
        }

        // Make directory
        if (fail) {
            await Wrapper.mkdir(this._path, { recursive: true });
        }
    }

    /**
     * Creates the folder synchronously if the path doesn't exists.
     */
    makeSync(): void {
        // Test folder existence
        let fail = false;
        try {
            this.statsSync();
        } catch (err) {
            fail = true;
        }

        // Make directory
        if (fail) {
            fs.mkdirSync(this._path, { recursive: true });
        }
    }

    async children(): Promise<FolderChildren> {
        const names = await Wrapper.readDir(this._path);
        const resp: FolderChildren = {
            folders: [],
            files: []
        };

        for (const name of names) {
            const path = join(this._path, name);
            const stat = await Wrapper.stats(path);

            if (stat.isDirectory()) {
                const obj = new Folder(path);
                resp.folders.push(obj);
            } else if (stat.isFile()) {
                const obj = new File(path);
                resp.files.push(obj);
            }
        }

        return resp;
    }

    childrenSync(): FolderChildren {
        const names = fs.readdirSync(this._path);
        const resp: FolderChildren = {
            folders: [],
            files: []
        };

        for (const name of names) {
            const path = join(this._path, name);
            const stat = fs.statSync(path);

            if (stat.isDirectory()) {
                const obj = new Folder(path);
                resp.folders.push(obj);
            } else if (stat.isFile()) {
                const obj = new File(path);
                resp.files.push(obj);
            }
        }

        return resp;
    }
    
    async delete(): Promise<void> {
        await Wrapper.rm(this._path, { recursive: true });
    }

    deleteSync(): void {
        return fs.rmSync(this._path, { recursive: true });
    }

    async copy(...pathParts: string[]): Promise<Folder> {
        const resp = new Folder(...pathParts);
        const inside = await this.children();

        // Copy files inside
        await resp.make();
        for (const file of inside.files) {
            await file.copy(...pathParts, file.name);
        }

        // Recursive iteration
        for (const folder of inside.folders) {
            await folder.copy(...pathParts, folder.name);
        }

        return resp;
    }

    async move(...pathParts: string[]): Promise<void> {
        const dest = resolve(...pathParts);
        await this.copy(dest);
        await this.delete();
        this._path = dest;
    }
}