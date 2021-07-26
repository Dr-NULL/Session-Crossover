import { Current, Manager, Options } from './interfaces';
import { CurrentSession } from './current-session';
import { CookieManager } from '../tool/cookie-manager';
import { Queue } from './queue';
import { SessionNotFoundError } from './errors';

export class SessionManager<T = any> implements Manager<T> {
    private _cookieManager: CookieManager;
    private _options: Options;
    private _queue: Queue;

    private _current: CurrentSession<T>;
    public get current(): Current<T> {
        return this._current;
    }

    constructor(cookieManager: CookieManager, options: Options, queue: Queue) {
        this._cookieManager = cookieManager;
        this._options = options;
        this._queue = queue;

        // Get session id
        const cookie = this
            ._cookieManager
            .get(this._options.name);

        // Get current session
        if (cookie) {
            this._current = this._queue.find(cookie.value);
            if (!this._current) {
                throw new SessionNotFoundError(cookie.value);
            }
        }
    }

    async create(): Promise<void> {
        // Get session id
        let cookie = this
            ._cookieManager
            .get(this._options.name);

        // Destroy the current cookie
        if (cookie) {
            cookie.kill({ path: '/' });
        }

        // Destroy the current session
        if (this._current) {
            this._current.destroy();
        }

        // Create new Session
    }

    async delete(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}