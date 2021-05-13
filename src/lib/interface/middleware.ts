import { Request, Response, NextFunction, Errback } from 'express';

export type Middleware = (
    req: Request,
    res: Response,
    nxt: NextFunction
) => void | Promise<void>;
