import express from "express"
import { Request, Dictionary } from "express-serve-static-core"

import { clearFolder } from "./clear-folder";
import { Options } from "./options"
import { Session } from "./session"

let isDeployed = false
export let deploy = (opt: Options) => {
    if (opt.cookieName == undefined) {
        opt.cookieName = "session"
    }
    if (opt.isEncrypted == undefined) {
        opt.isEncrypted = false
    }

    //Kill all files
    if (!isDeployed) {
        isDeployed = true
        clearFolder(opt.path)
    }

    //This will be execute before than the endpoint
    return async(req: Request<Dictionary<string>>, res: express.Response, nxt: express.NextFunction) => {
        req.session = new Session(opt, req, res)
        nxt()
    }
}