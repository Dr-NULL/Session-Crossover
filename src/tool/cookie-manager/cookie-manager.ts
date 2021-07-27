import { RequestWithCookies, ResponseForCookies, Cookie } from './interfaces';
import { CookieElement } from './cookie-element';
import { CookieOptions } from 'express';

export class CookieManager {
    private _req: RequestWithCookies;
    private _res: ResponseForCookies;
    private _opt: CookieOptions;

    constructor(
        req: RequestWithCookies,
        res: ResponseForCookies,
        opt?: CookieOptions,
    ) {
        this._req = req;
        this._res = res;
        this._opt = opt;
    }

    getAll(): Cookie[] {
        // Get raw cookies
        const raw = this._req.headers.cookie;
        if (!raw) {
            return null;
        }

        const names = raw
            .replace(/(^|;)[^=;]+(;\s+|$)/gi, '')
            .replace(/;\s+/gi, '\n')
            .replace(/=[^=]+$/gim, '')
            .split(/\n/gi);

        if (names) {
            // Make the array
            return names
                .map(name => new CookieElement(
                    this._req,
                    this._res,
                    name
                ));
        } else {
            // Make an empty array
            return [];
        }
    }

    get<T = any>(name: string): Cookie<T> | null {
        const raw = this._req.headers.cookie;
        if (!raw) {
            return null;
        }

        const names = raw
        	.replace(/(^|;)[^=;]+(;\s+|$)/gi, '')
            .replace(/;\s+/gi, '\n')
            .replace(/=[^=]+$/gim, '')
            .split(/\n/gi);
            
        const found = names?.find(x => x === name);
        if (found) {
            return new CookieElement<T>(this._req, this._res, name);
        } else {
            return null;
        }
    }

    new<T = any>(name: string, value: any, options?: CookieOptions): Cookie<T> {
        const elem = new CookieElement<T>(this._req, this._res, name);
        elem.value = value;
        return elem;
    }
}