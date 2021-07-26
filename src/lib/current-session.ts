import { File } from '../tool/fsys';
import { Current } from './interfaces';

export class CurrentSession<T = any> implements Current<T> {
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

    private _value: T;
    public get value(): T {
        return this._value;
    }
    public set value(v: T) {
        this._value = v;
    }

    private _onExpires: (hash: string) => void;
    public get onExpires(): (hash: string) => void {
        return this._onExpires;
    }
    public set onExpires(v: (hash: string) => void) {
        this._onExpires = v;
    }

    constructor(hash: string, expires: number, folder: string) {
        this._hash = hash;
        this._expires = expires;
        this._file = new File(`${folder}/${hash}.json`);

        this._clock = setTimeout(
            this._onTimeout.bind(this),
            this._expires
        );
    }

    private async _onTimeout(): Promise<void> {
        await this.destroy();
        if (this._onExpires) {
            this._onExpires(this._hash);
        }
    }

    rewind(): void {
        clearTimeout(this._clock);
        this._clock = setTimeout(
            this._onTimeout.bind(this),
            this._expires
        );
    }

    async load(): Promise<void> {
        if (await this._file.exists()) {
            const byte = await this._file.read();
            const text = byte.toString('utf8');
            this._value = JSON.parse(text);
        } else {
            this._value = null;
        }
    }

    async save(): Promise<void> {
        const text = JSON.stringify(this._value, null, '    ');
        const byte = Buffer.from(text, 'utf8');
        return this._file.write(byte);
    }

    async destroy(): Promise<void> {
        clearTimeout(this._clock);
        this._clock = null;

        if (await this._file.exists()) {
            return this._file.delete();
        }
    }
}