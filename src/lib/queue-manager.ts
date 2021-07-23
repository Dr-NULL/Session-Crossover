import { CookieManager, RequestWithCookies, ResponseForCookies } from '../tool/cookie-manager';
import { Hash } from '../tool/hasher';

export class Queue {
    private static _data: { [key: string]: Queue } = {};

    private _cookieManager: CookieManager;
    private _req: RequestWithCookies;
    private _res: ResponseForCookies;

    private constructor(
        req: RequestWithCookies,
        res: ResponseForCookies
    ) {
        this._cookieManager = new CookieManager(req, res);
        this._req = req;
        this._res = res;
    }
    
    find(hash: string): Queue | null;
    find(hash: Hash): Queue | null;
    find(hash: Buffer): Queue | null;
    find(input: string | Buffer | Hash): Queue | null {
        let key: string;
        if (Buffer.isBuffer(input)) {
            key = input.toString('hex');
        } else if (input instanceof Hash) {
            key = input.toHexString();
        } else if (typeof input === 'string') {
            key = input;
        } else {
            throw new Error('Input data type provided is invalid.');
        }

        const output = Queue._data[key];
        return output ?? null;
    }
}