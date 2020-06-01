import { Request, Response } from "express";
import { getCookies } from '../tool/cookie';

import { File } from '../tool/file';
import { Main } from './main';

import { SessionManager } from './interfaces/session-manager';
import { timestamp } from '../tool/timestamp';
import { Current } from './current';
import { Json } from './interfaces/json';

export class Manager implements SessionManager {
  private _req: Request;
  private _res: Response;

  private _current: Current;
  public get current(): Current {
    return this._current
  }

  public constructor(req: Request, res: Response) {
    // Add reference
    this._req = req
    this._res = res
    
    // Search cookie
    const cookies = getCookies(this._req)
    const id = cookies[Main.encr(Main.opt.cookieName)]
    
    // Search file
    if (id) {
      const file = new File(
        false,
        Main.opt.path,
        Main.decr(id) + '.json'
      )

      // Add as current
      if (file.exists) {
        this._current = new Current(file)
      }
    } else {
      // Kill Cookie
      this._res.clearCookie(
        Main.encr(Main.opt.cookieName),
        { path: '/' }
      )
    }
  }

  create() {
    // Kill current file
    if (this._current) {
      if (this._current.file.exists) {
        this._current.file.delete()
      }
    }

    // Build new cookie
    const expires = Main.opt.expires * 60 * 1000
    const id = timestamp(Main.opt.filenameLength)
    this._res.cookie(
      Main.encr(Main.opt.cookieName),
      Main.encr(id),
      {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + expires),
      }
    )

    // Build new file
    const file = new File(
      false,
      Main.opt.path,
      id + '.json'
    )

    // Make file data
    const json: Json = {
      created: new Date(),
      expires: new Date(Date.now() + expires),
      data: null
    }

    // Write data into the file
    const text = JSON.stringify(json, null, '  ')
    file.writeTextSync(Main.encr(text))
    this._current = new Current(file)

    // delete the file created
    setTimeout(() => {
      if (
        (Main.opt.callback) &&
        (file.exists)
      ) {
        Main.opt.callback(this._current.getData())
      } else if (Main.opt.callback) {
        Main.opt.callback(null);
      }

      if (file.exists) {
        file.delete()
      }
    }, expires);
  }

  public delete() {
    if (!this._current) {
      return
    }

    // Matar cookie
    const name = Main.encr(Main.opt.cookieName)
    this._res.clearCookie(name, { path: '/' })

    // Matar archivo
    if (this._current.file.exists) {
      this._current.file.delete()
    }

    // Matar instancia sesión
    this._current = undefined
  }
}