import * as fsModule from 'fs'; 
import * as pathModule from 'path';

export class File {
    private _path: string;
    /**
     * Gets the absolute path of the current file.
     */
    public get path(): string {
        return this._path;
    }

    /**
     * Create a new File instance, which can read, write or delete the file.
     * @param pathParts parts of the file path, these will be resolved relative to cwd.
     */
    constructor(...pathParts: string[]) {
        this._path = pathModule.resolve(...pathParts);
    }

    /**
     * Checks the folder of the current file, if the folder doesn't exists,
     * the folder will be created recursively.
     */
    makeFolder(): Promise<void> {
        const pathFolder = pathModule.resolve(this._path, '..');
        return new Promise((resolve, reject) => {
            fsModule.stat(pathFolder, err1 => {
                if (err1) {
                    // Create the folder
                    fsModule.mkdir(pathFolder, { recursive: true }, err2 => {
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

    /**
     * Gets a promise with the stats of the current file. If the file doesn't
     * exists, throws an error.
     * @returns A Promise with the Stats of the current file.
     */
    stats(): Promise<fsModule.Stats>
    stats(bigInt: false): Promise<fsModule.Stats>
    stats(bigInt: true): Promise<fsModule.BigIntStats>
    stats(bigInt?: boolean): Promise<fsModule.Stats | fsModule.BigIntStats> {
        const opt: fsModule.StatOptions = {
            bigint: bigInt
        };

        return new Promise((resolve, reject) => {
            fsModule.stat(this._path, opt, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stats);
                }
            });
        });
    }

    /**
     * Deletes asynchronously the file in the actual path.
     */
    delete(): Promise<void> {
        return new Promise((resolve, reject) => {
            fsModule.unlink(this.path, fail => {
                if (fail) {
                    reject(fail);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Reads the file, and returns a buffer with its content.
     * @returns The Buffer containing the content of the file.
     */
    read(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fsModule.readFile(this.path, (err, byte) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(byte);
                }
            });
        });
    }

    /**
     * Writes a Buffer into a file, if the file doesn't exists, this will be create.
     * By default, the encoding used it's UTF-8.
     * @param byte A Buffer with the content to be write.
     * @param options An optional object with the options for the write operation.
     */
    async write(byte: Buffer, options?: fsModule.WriteFileOptions): Promise<void> {
        await this.makeFolder();
        if (!options) {
            options = { };
        }

        return new Promise((resolve, reject) => {
            fsModule.writeFile(this._path, byte, options, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Copies the current file into the destination path.
     * @param pathParts Parts of the destination file path, these will be resolved relative to cwd.
     * @returns A Promise with the File instance of the copies file.
     */
    async copy(...pathParts: string[]): Promise<File> {
        await this.makeFolder();
        const pathFile = pathModule.resolve(...pathParts);

        return new Promise<File>(async (resolve, reject) => {
            fsModule.copyFile(this._path, pathFile, err => {
                if (err) {
                    reject(err);
                } else {
                    const file = new File(pathFile);
                    resolve(file);
                }
            });
        });
    }

    /**
     * Moves the current file into the destination path, replacing the current path.
     * @param pathParts Parts of the destination file path, these will be resolved relative to cwd.
     */
    async move(...pathParts: string[]): Promise<void> {
        await this.copy(...pathParts);
        await this.delete();

        this._path = pathModule.resolve(...pathParts);
    }
}
