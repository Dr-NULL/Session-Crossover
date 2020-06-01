"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
class Current {
    constructor(file) {
        this._file = file;
        const json = this.read();
        this._created = new Date(json.created);
        this._expires = new Date(json.expires);
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
        const text = this._file.readTextSync();
        const json = JSON.parse(main_1.Main.decr(text));
        return json;
    }
    getData() {
        const json = this.read();
        return json.data;
    }
    setData(data) {
        const json = this.read();
        json.data = data;
        const text = JSON.stringify(json, null, '  ');
        this._file.writeTextSync(main_1.Main.encr(text));
    }
}
exports.Current = Current;
//# sourceMappingURL=current.js.map