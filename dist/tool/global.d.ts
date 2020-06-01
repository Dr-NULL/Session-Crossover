import { Session } from '../lib/session';
declare global {
    namespace Express {
        interface Request {
            session: Session;
        }
    }
}
//# sourceMappingURL=global.d.ts.map