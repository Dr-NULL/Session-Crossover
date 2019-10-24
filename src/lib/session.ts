import express from "express"
import { Request, Dictionary } from "express-serve-static-core"

import * as Galleta from "../tool/galleta";
import { Options } from "./options";
import { makeId } from "./make-id";
import { getFile } from "./get-file";

import { encrypt, clocks } from "..";
import { File } from "../tool/file"

export class Session{
    private _id: string
    /**Random ID assignet to a every new request made to any endpoint, until the session has created with `this.new()`*/
    public get id(): string {
        return this._id
    }

    //References to ExpressJS
    private _request: Request<Dictionary<string>>
    private _response: express.Response

    //File Location
    private _file: File
    private _timer : number

    private _options: Options
    private _isCreated: boolean
    /**Gets the status of the current session. If is `true`, this connection has a session created, else returns `false` */
    public get isCreated() : boolean {
        return this._isCreated;
    }

    private _expires: number
    public get expiresMs(): number {
        let now = Date.now()
        let ms = this._expires - now

        return ms
    }
    public get expiresSec(): number {
        return this.expiresMs / 1000
    }
    public get expiresMin(): number {
        return this.expiresSec / 60
    }

    private _raw: { id: string, expires: number, data: any }
    public get data() : any {
        if (this._isCreated) {
            this._raw = JSON.parse(this._file.readSync())
            return this._raw.data;
        } else {
            throw("The session wasn't yet created, so you can't read data.")
        }
    }
    public set data(v : any) {
        if (this._isCreated) {
            this._raw = JSON.parse(this._file.readSync())
            this._raw.data = v;
    
            this._file.writeSync(JSON.stringify(this._raw))
        } else {
            throw("The session wasn't yet created, so you can't write data.")
        }
    }
    

    constructor(opt: Options, req: Request<Dictionary<string>>, res: express.Response){
        //Default
        this._options = opt
        this._request = req
        this._response = res
        this._isCreated = false

        //Read client cookies
        let value = Galleta.getValue(
            req.headers.cookie,
            opt.cookieName
        )

        //Get or build the ID
        if (value == null) {
            //Making the ID
            this._id = makeId(req.ip)
        } else {
            //Desencrypt the ID
            if(this._options.isEncrypted) {
                this._id = encrypt.decrypt(value)
            } else {
                this._id = value
            }
        }

        //Get file
        this._file = getFile(this._id, this._options.path)
        this._isCreated = this._file.existsSync

        if ((!this._isCreated) && (value != null)) {
            this._response.clearCookie(this._options.cookieName)
            this._id = makeId(req.ip)
            this._file = getFile(this._id, this._options.path)
        }
    }

    public new() {
        if (this._isCreated) {
            return
        }

        //Make cookie
        let value
        if (this._options.isEncrypted) {
            value = encrypt.encrypt(this._id)
        } else {
            value = this._id
        }
        this._expires = this._options.expires * 60 * 1000
        this._response.clearCookie(this._options.cookieName)
        this._response.cookie(
            this._options.cookieName,
            value,
            {
                expires: new Date(Date.now() + this._expires)
            }
        )

        //Make File
        this._raw = {
            id: this._id,
            expires: this._expires,
            data: null
        }
        this._file.writeSync(JSON.stringify(this._raw))
        let timer = setTimeout(() => {
            this._file.kill()
        }, this._expires);

        clocks.push({
            id: this._id,
            timer: timer
        })
        this._isCreated = true
    }

    public kill() {
        this._response.clearCookie(this._options.cookieName)
        let i = clocks.findIndex(x => x.id == this._id)
        if (i == -1) {
            throw("This session wasn't created, so you can't delete a session that doesn't exists.")
        }

        clearTimeout(clocks[i].timer)
        if (this._file.existsSync) {
            this._file.kill()
        }
        this._raw = {
            id: this._id,
            expires: null,
            data: null
        }

        this._isCreated = false
    }
}