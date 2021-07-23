import { Middleware, Options } from './interfaces';
import { SessionManager } from './session-manager';

export function sessionCrossover(options: any): Middleware {
    return async (req, res, nxt) => {
        const manager = new SessionManager(req, res, options);
        req.session = manager;

        nxt();
    };
}