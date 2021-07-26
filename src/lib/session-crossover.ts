import { Middleware, Options } from './interfaces';
import { SessionManager } from './session-manager';
import { Queue } from './queue';
import { CookieManager } from '../tool/cookie-manager';

export function sessionCrossover(options: Options): Middleware {
    if (!options.name) { options.name = 'session-id' };
    if (!options.expires) { options.expires = 1000 * 60 * 30 };
    const queue = new Queue(options);

    return async (req, res, nxt) => {
        const cookieManager = new CookieManager(req, res);
        req.session = new SessionManager(
            cookieManager,
            options,
            queue
        );

        nxt();
    };
}