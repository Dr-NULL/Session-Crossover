import { InvalidHashLengthError } from './errors';
import { Middleware, Options } from './interfaces';
import { SessionManager } from './session-manager';
import { CookieManager } from '../tool/cookie-manager';
import { Folder } from '../tool/fsys';
import { Queue } from './queue';

export function sessionCrossover(options: Options): Middleware {
    if (!options.name) { options.name = 'session-id' };
    if (!options.expires) { options.expires = 1000 * 60 * 30 };
    if (!options.hashLength) { options.hashLength = 32; }

    // Calc hash length
    if (
        (options.hashLength < 8) ||
        (options.hashLength > 256)
    ) {
        throw new InvalidHashLengthError(options.hashLength);
    }
    
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