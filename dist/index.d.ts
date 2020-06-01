/// <reference types="qs" />
/// <reference types="express" />
import { SessionManager } from './lib/interfaces/session-manager';
declare global {
    namespace Express {
        interface Request {
            session: SessionManager;
        }
    }
}
export declare const deploy: (options: import("./lib/interfaces/options").Options) => (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: import("express").Response<any>, nxt: import("express").NextFunction) => void;
//# sourceMappingURL=index.d.ts.map