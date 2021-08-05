import { Middleware, Options } from './interfaces';
import { CookieManager } from '../tool/cookie-manager';

export function sessionCrossover(options: Options): Middleware {
    if (!options.name) { options.name = 'session-id' };
    if (!options.maxAge) { options.maxAge = 1000 * 60 * 30 };
    if (!options.cipherAlgorithm) { options.cipherAlgorithm = 'aes-128-ccm'; }
    
    return async (req, res, nxt) => {
        const cookieManager = new CookieManager(req, res);

        nxt();
    };
}