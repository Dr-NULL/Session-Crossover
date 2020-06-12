/// <reference types="node" />
import { Request, Response } from "express";
import { SessionManager } from './interfaces/session-manager';
import { Current } from './current';
export declare type tail = {
    [key: string]: NodeJS.Timer;
};
export declare class Manager implements SessionManager {
    private _req;
    private _res;
    private static _tail;
    private _current;
    readonly current: Current;
    constructor(req: Request, res: Response);
    create(): void;
    delete(): void;
    rewind(min?: number): void;
    /**
     * Create a new timeout for add to te tail.
     * @param file File instance.
     * @param expires Time in milliseconds
     */
    private makeTimeout;
}
//# sourceMappingURL=manager.d.ts.map