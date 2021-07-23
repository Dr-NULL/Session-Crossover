import { CookieManager, RequestWithCookies, ResponseForCookies } from '../tool/cookie-manager';
import { Manager, Options } from './interfaces';
import { Hasher } from '../tool/hasher';

export class SessionManager implements Manager {
    private _cookieManager: CookieManager;
    private _hasher: Hasher;
    private _req: RequestWithCookies;
    private _res: ResponseForCookies;
    private _opt: Options;

    constructor(req: RequestWithCookies, res: ResponseForCookies, opt: Options) {
        this._cookieManager = new CookieManager(req, res);
        this._req = req;
        this._res = res;
        this._opt = opt;

        this._hasher = new Hasher();
        this._hasher.hashLength = 32;
    }

    current(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    rewind(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async create(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}