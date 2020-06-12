"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
class Current {
    constructor(id, file) {
        this._id = id;
        this._file = file;
        const json = this.read();
        this._created = new Date(json.created);
        this._expires = new Date(json.expires);
    }
    get id() {
        return this._id;
    }
    get file() {
        return this._file;
    }
    get created() {
        return this._created;
    }
    get expires() {
        return this._expires;
    }
    read() {
        if (this._file.exists) {
            const text = this._file.readTextSync();
            const json = JSON.parse(main_1.Main.decr(text));
            return json;
        }
        else {
            return null;
        }
    }
    write(obj) {
        const text = JSON.stringify(obj, null, '  ');
        if (this._file.exists) {
            this._file.writeTextSync(main_1.Main.encr(text));
        }
    }
    getData() {
        const json = this.read();
        return json.data;
    }
    setData(data) {
        const json = this.read();
        json.data = data;
        this.write(json);
    }
}
exports.Current = Current;
//# sourceMappingURL=current.js.map