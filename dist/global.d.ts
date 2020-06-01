import { SessionManager } from './lib/interfaces/session-manager';
declare global {
    namespace Express {
        interface Request {
            session: SessionManager;
        }
    }
}
//# sourceMappingURL=global.d.ts.map