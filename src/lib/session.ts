import express from "express"
import { Request, Dictionary } from "express-serve-static-core"

import * as Galleta from "./galleta";
import { Options } from "./options";

import { makeId } from "./make-id";
import { crypto } from "../index";

export class Session{
    private _id: string

    constructor(opt: Options, req: Request<Dictionary<string>>, res: express.Response){
        let value = Galleta.getValue(
            req.headers.cookie,
            opt.cookieName
        )

        //Making the ID
        if (value == null) {
            this._id = makeId(req.ip)
        } else {
            
        }
    }
}