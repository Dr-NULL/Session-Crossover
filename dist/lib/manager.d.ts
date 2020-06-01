import { Request, Response } from "express";
import { SessionManager } from './interfaces/session-manager';
import { Current } from './current';
export declare class Manager implements SessionManager {
    private _req;
    private _res;
    private _current;
    readonly current: Current;
    constructor(req: Request, res: Response);
    create(): void;
    delete(): void;
}
//# sourceMappingURL=manager.d.ts.map