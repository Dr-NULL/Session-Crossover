import { Current, Manager, Options } from './interfaces';
import { Cookie, CookieManager } from '../tool/cookie-manager';
import { CurrentSession } from './current-session';
import { Queue } from './queue';

export class SessionManager implements Manager {
    private _cookieManager: CookieManager;
    private _current: CurrentSession;
    private _options: Options;
    private _queue: Queue;

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
                cookie.kill({ path: '/' });
            }
        }
    }

    private _destroy(): void {
        this._current = null;
        this.delete();
    }

    public current<T = any>(): Current<T> {
        return this._current;
    }

    async create(): Promise<void> {
        // Destroy the current session
        await this.delete();

        // Create new Session
        this._current = await this._queue.new();
        this._current.onDestroy = this._destroy.bind(this);

        // Search the cookie
        let cookie: Cookie = this
            ._cookieManager
            .get(this._options.name);

        if (!cookie) {
            // Create the new cookie
            cookie = this._cookieManager.new(
                this._options.name,
                this._current.hash
            );
        } else {
            // Update the current cookie
            cookie.value = this._current.hash;
        }

        // Save cookie
        cookie.save({
            path: '/',
            secure: true,
            maxAge: this._options.expires,
            httpOnly: true,
        });
    }

    async delete(): Promise<void> {
        // Destroy the current session
        if (this._current) {
            await this._current.destroy();
        }

        // Search the cookie
        const cookie: Cookie = this
            ._cookieManager
            .get(this._options.name);

        // Destroy the cookie
        if (cookie) {
            cookie.kill({
                path: '/',
                secure: true,
                httpOnly: true,
            });
        }
    }

    rewind(): void {
        if (this._current) {
            // Reset the current session timeout
            this._current.rewind();

            // Search the cookie
            const cookie: Cookie = this
                ._cookieManager
                .get(this._options.name);
    
            // Save cookie
            if (cookie) {
                cookie.save({
                    path: '/',
                    secure: true,
                    maxAge: this._options.expires,
                    httpOnly: true,
                });
            }
        }
    }
}