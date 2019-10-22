import express from "express"
import { Request, Dictionary } from "express-serve-static-core";

import * as Galleta from "./lib/galleta";

export interface iOptions {
    /**Carpeta en la cual se guardarán los datos */
    path: string;
    /**Tiempo de vida de la sesión (min) */
    expires: number;
    /**Nombre de la cookie que contendrá la función */
    cookieName?: string;
    /**Encriptar o no el archivo */
    encrypted?: boolean;
}

export let implement = (opt: iOptions) => {
    if (opt.cookieName == undefined) {
        opt.cookieName = "session"
    }
    if (opt.encrypted == undefined) {
        opt.encrypted = false
    }

    //This will be execute before than the endpoint
    return (req: Request<Dictionary<string>>, res: express.Response, nxt: express.NextFunction) => {
        let cookie = Galleta.getValue(
            req.headers.cookie,
            opt.cookieName
        )
        



        nxt()
    }
}