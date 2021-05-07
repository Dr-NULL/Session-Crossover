import * as fsModule from 'fs'; 
import * as pathModule from 'path';

import { File } from './file';
import { FolderContent } from './folder-content';

export class Folder {
    static fromFile(file: File): Folder {
        return new Folder(file.path, '..');
    }

    private _path: string;
    /**
     * Gets the path of the current folder.
     */
    public get path(): string {
        return this._path;
    }

    /**
     * 
     * @param pathParts Parts of the folder path, these will be resolved relative to cwd.
     */
    constructor(...pathParts: string[]) {
        this._path = pathModule.resolve(...pathParts);
    }

    /**
     * Checks the current folder asynchronously, if doesn't exists,
     * the folder will be created recursively.
     */
    make(): Promise<void> {
        return new Promise((resolve, reject) => {
            fsModule.stat(this._path, err1 => {
                if (err1) {
                    // Create the folder
                    fsModule.mkdir(this._path, { recursive: true }, err2 => {
                        if (err2) {
                            reject(err2);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    // Folder already exists
                    resolve();
                }
            });
        });
    }

    content(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fsModule.readdir(this._path, async (err, paths) => {
                if (err) {
                    reject(err);
                } else {
                    for (let path of paths) {
                        path = pathModule.join (this._path, path);
                    }
                }
            });
        });
    }
}
