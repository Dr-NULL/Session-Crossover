import crypto from "crypto"

class Secret {
    private _key: Buffer
    public get key() {
        return this._key.toString("utf-8")
    }
    public get keyArray() {
        let key = this.key
        return key.split("").map(item => { return item.charCodeAt(0) })
    }
    public set key(value: string) {
        this._key = Buffer.alloc(this._key.length)
        this._key.write(value, "utf-8")
    }
    public set keyArray(v: number[]) {
        let value = v.reduce((prev, next) => { return prev + String.fromCharCode(next) }, "")
        this._key = Buffer.alloc(this._key.length)
        this._key.write(value, "utf-8")
    }

    private _iv: Buffer
    public get iv() {
        return this._iv.toString("utf-8")
    }
    public get ivArray() {
        let iv = this.iv
        return iv.split("").map(item => { return item.charCodeAt(0) })
    }
    public set iv(value: string) {
        this._iv = Buffer.alloc(this._iv.length)
        this._iv.write(value, "utf-8")
    }
    public set ivArray(v: number[]) {
        let value = v.reduce((prev, next) => { return prev + String.fromCharCode(next) }, "")
        this._iv = Buffer.alloc(this._iv.length)
        this._iv.write(value, "utf-8")
    }

    constructor() {
        this._key = Buffer.from(crypto.randomBytes(16))
        this._iv = Buffer.from(crypto.randomBytes(8))
    }

    public encrypt(text: string) {
        let cipher = crypto.createCipheriv("aes-128-gcm", this._key, this._iv)
        let data = Buffer.concat([
            cipher.update(text),
            cipher.final()
        ])

        return data.toString("hex")
    }

    public decrypt(text: string) {
        let cipher = crypto.createCipheriv("aes-128-gcm", this._key, this._iv)
        let data = Buffer.concat([
            cipher.update(Buffer.from(text, "hex")),
            cipher.final()
        ])

        return data.toString("utf-8")
    }
}
export default Secret