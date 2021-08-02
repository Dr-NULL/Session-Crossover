import { FSys } from './fsys';
import { resolve } from 'path';

import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

export class File extends FSys {
    constructor(...pathParts: string[]) {
        super(...pathParts);
    }

    async delete(): Promise<void> {
        await fsPromises.unlink(this._path);
    }

    deleteSync(): void {
        return fs.unlinkSync(this._path);
    }

    async copy(...pathParts: string[]): Promise<File> {
        const file = new File(...pathParts);
        await fsPromises.copyFile(this._path, file.path);
        return file;
    }

    copySync(...pathParts: string[]): File {
        const file = new File(...pathParts);
        fs.copyFileSync(this._path, file.path);
        return file;
    }

    async move(...pathParts: string[]): Promise<void> {
        const dest = resolve(...pathParts);
        await fsPromises.copyFile(this._path, dest);
        await fsPromises.unlink(this._path);
        this._path = dest;
    }

    moveSync(...pathParts: string[]): void {
        const dest = resolve(...pathParts);
        fs.copyFileSync(this._path, dest);
        fs.unlinkSync(this._path);
        this._path = dest;
    }

    public read(): Promise<Buffer> {
        return fsPromises.readFile(this._path);
    }

    public write(byte: Buffer): Promise<void> {
        return fsPromises.writeFile(this._path, byte);
    }
}
