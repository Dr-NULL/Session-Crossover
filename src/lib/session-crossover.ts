import { Middleware, Options } from './interfaces';
import { SessionManager } from './session-manager';
import { Queue } from './queue';
import { CookieManager } from '../tool/cookie-manager';
import { Folder } from '../tool/fsys';

export function sessionCrossover(options: Options): Middleware {
    if (!options.name) { options.name = 'session-id' };
    if (!options.expires) { options.expires = 1000 * 60 * 30 };
    
    const queue = new Queue(options);
    const folder = new Folder(options.path);
    if (!folder.existsSync()) {
        folder.makeSync();
    }
    
    return async (req, res, nxt) => {
        const cookieManager = new CookieManager(req, res);
        req.session = new SessionManager(
            cookieManager,
            queue,
            options,
        );

        nxt();
    };
}