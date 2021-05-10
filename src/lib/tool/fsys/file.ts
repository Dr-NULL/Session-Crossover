import { FSys } from './fsys';
import { resolve } from 'path';
import * as Wrapper from './fs-wrappers';

export class File extends FSys {
    constructor(...pathParts: string[]) {
        super(...pathParts);
    }

    async delete(): Promise<void> {
        await Wrapper.unlink(this._path);
    }

    async copy(...pathParts: string[]): Promise<File> {
        const file = new File(...pathParts);
        await Wrapper.copyFile(this._path, file.path);
        return file;
    }

    async move(...pathParts: string[]): Promise<void> {
        const dest = resolve(...pathParts);
        await Wrapper.copyFile(this._path, dest);
        await Wrapper.unlink(this._path);
        this._path = dest;
    }

    async read(): Promise<Buffer> {
        return Wrapper.readFile(this._path);
    }

    async write(byte: Buffer): Promise<void> {
        return Wrapper.writeFile(this._path, byte);
    }
}
