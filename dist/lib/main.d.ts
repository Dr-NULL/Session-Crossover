/// <reference types="qs" />
import { Request, Response, NextFunction } from "express";
import { AESCrypto } from "../tool/aes-crypto";
import { Options } from "./interfaces/options";
import { FileSys } from "../tool/file-sys";
export declare module Main {
    let crypto: AESCrypto;
    let folder: FileSys;
    let opt: Options;
    /**
     * Initialize the Session-Crossover module.
     * @param options Configuration object for the middleware.
     */
    const deploy: <T>(options: Options) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>, nxt: NextFunction) => void;
    /**
     * Encrypt a string if the crypto object is instanciated.
     * @param input A string that would be encrypt.
     */
    const encr: (input: string) => string;
    /**
     * Decrypt a string if the crypto object is instanciated.
     * @param input A string that would be decrypt.
     */
    const decr: (input: string) => string;
}
//# sourceMappingURL=main.d.ts.map