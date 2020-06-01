"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aes_crypto_1 = require("../tool/aes-crypto");
const file_sys_1 = require("../tool/file-sys");
const manager_1 = require("./manager");
var Main;
(function (Main) {
    /**
     * Initialize the Session-Crossover module.
     * @param options Configuration object for the middleware.
     */
    Main.deploy = (options) => {
        // Default cookie name
        if (!options.cookieName) {
            options.cookieName = 'session';
        }
        // Default timestamp Length
        if (!options.filenameLength) {
            options.filenameLength = 96;
        }
        // Set crypto Keys
        if (options.aesType) {
            Main.crypto = new aes_crypto_1.AESCrypto(options.aesType);
        }
        // Clean Path
        Main.folder = new file_sys_1.FileSys(false, options.path);
        Main.folder.makeFolder();
        for (const file of Main.folder.children) {
            file.delete();
        }
        // Return middleware
        Main.opt = options;
        return (req, res, nxt) => {
            req.session = new manager_1.Manager(req, res);
            nxt();
        };
    };
    /**
     * Encrypt a string if the crypto object is instanciated.
     * @param input A string that would be encrypt.
     */
    Main.encr = (input) => {
        if (Main.crypto) {
            return Main.crypto.encrypt(input);
        }
        else {
            return input;
        }
    };
    /**
     * Decrypt a string if the crypto object is instanciated.
     * @param input A string that would be decrypt.
     */
    Main.decr = (input) => {
        if (Main.crypto) {
            return Main.crypto.decrypt(input);
        }
        else {
            return input;
        }
    };
})(Main = exports.Main || (exports.Main = {}));
//# sourceMappingURL=main.js.map