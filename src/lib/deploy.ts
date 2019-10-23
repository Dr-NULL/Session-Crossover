import express from "express"
import { Request, Dictionary } from "express-serve-static-core"

import { Options } from "./options"
import { Session } from "./session"

export let deploy = (opt: Options) => {
    if (opt.cookieName == undefined) {
        opt.cookieName = "session"
    }
    if (opt.isEncrypted == undefined) {
        opt.isEncrypted = false
    }

    //This will be execute before than the endpoint
    return async(req: Request<Dictionary<string>>, res: express.Response, nxt: express.NextFunction) => {
        req.session = new Session(opt, req, res)
        nxt()
    }
}