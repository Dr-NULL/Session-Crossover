import { FSys } from './fsys';
import { resolve } from 'path';

import * as fs from 'fs';
import * as Wrapper from './fs-wrappers';

export class File extends FSys {
    constructor(...pathParts: string[]) {
        super(...pathParts);
    }

    async delete(): Promise<void> {
        await Wrapper.unlink(this._path);
    }

    deleteSync(): void {
        return fs.unlinkSync(this._path);
    }

    async copy(...pathParts: string[]): Promise<File> {
        const file = new File(...pathParts);
        await Wrapper.copyFile(this._path, file.path);
        return file;
    }

    copySync(...pathParts: string[]): File {
        const file = new File(...pathParts);
        fs.copyFileSync(this._path, file.path);
        return file;
    }

    async move(...pathParts: string[]): Promise<void> {
        const dest = resolve(...pathParts);
        await Wrapper.copyFile(this._path, dest);
        await Wrapper.unlink(this._path);
        this._path = dest;
    }

    moveSync(...pathParts: string[]): void {
        const dest = resolve(...pathParts);
        fs.copyFileSync(this._path, dest);
        fs.unlinkSync(this._path);
        this._path = dest;
    }

    async read(): Promise<Buffer> {
        return Wrapper.readFile(this._path);
    }

    async write(byte: Buffer): Promise<void> {
        return Wrapper.writeFile(this._path, byte);
    }
}
