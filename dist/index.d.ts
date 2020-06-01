/// <reference types="qs" />
/// <reference types="express" />
export { SessionManager } from './lib/interfaces/session-manager';
export { Session } from './lib/interfaces/session';
export declare const deploy: (options: import("./lib/interfaces/options").Options) => (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: import("express").Response<any>, nxt: import("express").NextFunction) => void;
//# sourceMappingURL=index.d.ts.map