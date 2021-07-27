import { Cookie, RequestWithCookies, ResponseForCookies } from './interfaces';
import { CookieOptions } from 'express';
import { parse } from 'cookie';

export class CookieElement<T = any> implements Cookie<T> {
    private _req: RequestWithCookies;
    private _res: ResponseForCookies;

    private _name: string;
    get name(): string {
        return this._name;
    }

    private _found = false;
    private _value: T;
    public get value(): T {
        if (!this._found) {
            // Parse values
            const obj = parse(this._req.headers.cookie);
            this._found = true;

            // Find values for parse
            if (obj[this._name]?.startsWith('j:')) {
                try {
                    const ref = obj[this._name]?.replace(/^j\:/g, '');
                    this._value = JSON.parse(ref);
                } catch {
                    this._value = undefined;
                }
            } else {
                this._value = obj[this._name] as any;
            }
        }

        // Return the parsed value
        return this._value;
    }
    public set value(v: T) {
        // Parse the raw cookie string
        this._found = true;
        const obj = parse(this._req.headers.cookie ?? '');

        // Serialize the current value
        if (typeof v !== 'string') {
            obj[this._name] = `j:${JSON.stringify(v)}`;
        } else {
            obj[this._name] = v;
        }

        // Serialize all cookies
        let raw = '';
        Object.keys(obj).forEach((x, i) => {
            raw += `${i ? '; ' : ''}`;
            raw += x + '=';
            raw += encodeURIComponent(obj[x]);
        });

        // Replace values
        this._req.headers.cookie = raw;
        this._value = v;
    }

    constructor(
        req: RequestWithCookies,
        res: ResponseForCookies,
        name: string
    ) {
        this._req = req;
        this._res = res;
        this._name = name;
    }

    save(options?: CookieOptions): void {
        let value: string;
        if (typeof this._value === 'string') {
            value = this._value;
        } else {
            value = 'j:' + JSON.stringify(this._value);
        }

        this._res = this._res.cookie(this._name, value, options);
    }

    kill(options?: CookieOptions): void {
        this._res = this._res.clearCookie(this._name, options);
    }
}