import { Current, Manager, Options } from './interfaces';
import { SessionNotFoundError } from './errors';
import { CurrentSession } from './current-session';
import { CookieManager } from '../tool/cookie-manager';
import { Queue } from './queue';

export class SessionManager<T = any> implements Manager<T> {
    private _cookieManager: CookieManager;
    private _current: CurrentSession<T>;
    private _options: Options;
    private _queue: Queue<T>;


    constructor(cookieManager: CookieManager, queue: Queue, options: Options) {
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
        // Destroy the current session
        await this.delete();

        // Create new Session
        this._current = await this._queue.new();
        this._current.onDestroy = this._destroy.bind(this);

        // Create the new cookie
        const cookie = this._cookieManager.new(
            this._options.name,
            this._current.hash
        );
        cookie.save();
    }

    async delete(): Promise<void> {
        // Get session id
        const cookie = this
            ._cookieManager
            .get(this._options.name);

        // Destroy the current cookie
        if (cookie) {
            cookie.kill({ path: '/' });
        }

        // Destroy the current session
        if (this._current) {
            await this._current.destroy();
        }
    }

    public current(): Current<T> {
        return this._current;
    }

    private _destroy(hash: string): void {
        this._current = null;
        this.delete();
    }
}