import { File } from '../tool/fsys';
import { Current } from './interfaces';

export class CurrentSession<T = any> implements Current<T> {
    private _killed: boolean;
    private _clock: NodeJS.Timeout;
    private _file: File;

    private _hash: string;
    public get hash(): string {
        return this._hash;
    }

    private _expires: number;
    public get timeout(): number {
        return this._expires;
    }

    private _onDestroy: (hash: string) => void;
    public get onDestroy(): (hash: string) => void {
        return this._onDestroy;
    }
    public set onDestroy(v: (hash: string) => void) {
        this._onDestroy = v;
    }

    constructor(hash: string, expires: number, folder: string) {
        this._expires = expires;
        this._killed = false;
        this._hash = hash;
        this._file = new File(`${folder}/${hash}.json`);

        this._clock = setTimeout(
            this._onTimeout.bind(this),
            this._expires
        );
    }

    private async _onTimeout(): Promise<void> {
        await this.destroy();
        if (this._onDestroy) {
            this._onDestroy(this._hash);
        }
    }

    rewind(): void {
        clearTimeout(this._clock);
        this._clock = setTimeout(
            this._onTimeout.bind(this),
            this._expires
        );
    }

    async load(): Promise<T> {
        if (await this._file.exists()) {
            const byte = await this._file.read();
            const text = byte.toString('utf8');
            return JSON.parse(text);
        } else {
            return null;
        }
    }

    save(value: T): Promise<void> {
        if (!this._killed) {
            const text = JSON.stringify(value, null, '    ');
            const byte = Buffer.from(text, 'utf8');
            return this._file.write(byte);
        } else {
            return Promise.resolve();
        }
    }

    async destroy(): Promise<void> {
        clearTimeout(this._clock);
        this._killed = true;
        this._clock = null;

        if (await this._file.exists()) {
            await this._file.delete();
        }
    }
}