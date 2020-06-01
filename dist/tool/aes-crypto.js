"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const atob_1 = __importDefault(require("atob"));
const btoa_1 = __importDefault(require("btoa"));
class AESCrypto {
    constructor(type, password) {
        this._type = type;
        if (password) {
            // Base64 → String
            let raw;
            try {
                raw = atob_1.default(password);
            }
            catch {
                throw new Error('The password given its invalid.');
            }
            // String → Object
            let obj;
            try {
                obj = JSON.parse(raw);
                // Check Array
                if ((Object.getPrototypeOf(obj.key).constructor.name != 'Array') ||
                    (Object.getPrototypeOf(obj.key).constructor.name != 'Array')) {
                    throw new Error();
                }
                // Check Bytes
                for (const item of obj.key) {
                    if (typeof item != 'number') {
                        throw new Error();
                    }
                }
                for (const item of obj.iv) {
                    if (typeof item != 'number') {
                        throw new Error();
                    }
                }
                // Check Length
                if ((obj.key.length != 16) ||
                    (obj.iv.length != 8)) {
                    throw new Error();
                }
                this.key = obj.key;
                this.iv = obj.iv;
            }
            catch {
                throw new Error('The password given cannot be parsed.');
            }
        }
        else {
            const num = parseInt(this._type.replace(/[^0-9]/gi, ''), 10);
            this.key = crypto_1.randomBytes(num / 8).toJSON().data;
            this.iv = crypto_1.randomBytes(8).toJSON().data;
        }
    }
    get type() {
        return this._type;
    }
    generate() {
        const data = {
            key: this.key,
            iv: this.iv
        };
        return btoa_1.default(JSON.stringify(data, null, '  '));
    }
    encrypt(text) {
        let binKey = Buffer.from(this.key);
        let binIv = Buffer.from(this.iv);
        let cipher = crypto_1.createCipheriv(this._type, binKey, binIv);
        let data = Buffer.concat([
            cipher.update(text),
            cipher.final()
        ]);
        return data.toString("hex");
    }
    decrypt(text) {
        let binKey = Buffer.from(this.key);
        let binIv = Buffer.from(this.iv);
        let cipher = crypto_1.createCipheriv(this._type, binKey, binIv);
        let data = Buffer.concat([
            cipher.update(Buffer.from(text, "hex")),
            cipher.final()
        ]);
        return data.toString("utf8");
    }
}
exports.AESCrypto = AESCrypto;
//# sourceMappingURL=aes-crypto.js.map