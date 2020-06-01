import { Request, Response, NextFunction } from "express";
import { AESCrypto } from "../tool/aes-crypto";
import { Options } from "./interfaces/options";
import { FileSys } from "../tool/file-sys";
import { Manager } from "./manager";

export module Main {
  export let crypto: AESCrypto;
  export let folder: FileSys;
  export let opt: Options;
  
  /**
   * Initialize the Session-Crossover module.
   * @param options Configuration object for the middleware.
   */
  export const deploy = (options: Options) => {
    // Default cookie name
    if (!options.cookieName) {
      options.cookieName = 'session'
    }
  
    // Default timestamp Length
    if (!options.filenameLength) {
      options.filenameLength = 96
    }
  
    // Set crypto Keys
    if (options.aesType) {
      crypto = new AESCrypto(options.aesType)
    }
  
    // Clean Path
    folder = new FileSys(false, options.path)
    folder.makeFolder()
    for (const file of folder.children) {
      file.delete()
    }
  
    // Return middleware
    opt = options
    return (req: Request, res: Response, nxt: NextFunction) => {
      req.session = new Manager(req, res)
      nxt()
    }
  }
  
  /**
   * Encrypt a string if the crypto object is instanciated.
   * @param input A string that would be encrypt.
   */
  export const encr = (input: string) => {
    if (Main.crypto) {
      return Main.crypto.encrypt(input)
    } else {
      return input
    }
  }

  /**
   * Decrypt a string if the crypto object is instanciated.
   * @param input A string that would be decrypt.
   */
  export const decr = (input: string) => {
    if (Main.crypto) {
      return Main.crypto.decrypt(input)
    } else {
      return input
    }
  }
}