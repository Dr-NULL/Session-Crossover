import { File } from '../tool/fsys';
import { Current } from './interface';
import { JsonParser, Key } from '../tool/json-parser';
import * as Errors from './errors';

export class CurrentSession implements Current {
    private _file: File;
    private _json: JsonParser;
    
    private _expires: Date;
    public get expires(): Date {
        return this._expires;
    }

    constructor(expires: Date, ...pathParts: string[]) {
        this._file = new File(...pathParts);
        this._json = new JsonParser('  ');
        this._json.addToStringFunc(this._toString);
        this._json.addToObjectFunc(this._toObject);

        this._expires = expires;
    }

    private _toString(key: Key, value: any): any {
        if (typeof value === 'string') {
            return `string(${value})`;
        } else if (value instanceof Date) {
            return `date(${value.toJSON()})`;
        } else {
            return value;
        }
    }

    private _toObject(key: Key, value: any): any {
        if (typeof value === 'string') {
            if (value.match(/^string\(.*\)$/g)) {
                return value.replace(/(^string\(|\)$)/g, '');
            } else if (value.match(/^date\(.*\)$/g)) {
                value = value.replace(/(^date\(|\)$)/g, '');
                return new Date(value);
            } else {
                return value;
            }
        } else {
            return value;
        }
    }

    async load<T = any>(): Promise<T> {
        if (await this._file.exists()) {
            const byte = await this._file.read();
            const text = byte.toString('utf-8');
            return this._json.toObject(text);
        } else {
            throw new Errors.SessionNotFound();
        }
    }

    async save<T = any>(data: T): Promise<void> {
        if (await this._file.exists()) {
            const text = this._json.toString(data);
            const byte = Buffer.from(text, 'utf-8');
            return this._file.write(byte);
        } else {
            throw new Errors.SessionNotFound();
        }
    }
};