import { Request } from 'express';
export interface CookieObject {
    [key: string]: string;
}
export declare function getCookies(req: Request): CookieObject;
//# sourceMappingURL=cookie.d.ts.map