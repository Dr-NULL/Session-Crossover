"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = require("../tool/cookie");
const file_1 = require("../tool/file");
const main_1 = require("./main");
const timestamp_1 = require("../tool/timestamp");
const current_1 = require("./current");
class Manager {
    constructor(req, res) {
        // Add reference
        this._req = req;
        this._res = res;
        // Search cookie
        const cookies = cookie_1.getCookies(this._req);
        const id = cookies[main_1.Main.encr(main_1.Main.opt.cookieName)];
        // Search file
        if (id) {
            const file = new file_1.File(false, main_1.Main.opt.path, main_1.Main.decr(id) + '.json');
            // Add as current
            if (file.exists) {
                this._current = new current_1.Current(main_1.Main.decr(id), file);
            }
        }
        else {
            // Kill Cookie
            this._res.cookie(main_1.Main.encr(main_1.Main.opt.cookieName), '', {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                expires: new Date(0),
            });
        }
    }
    get current() {
        return this._current;
    }
    create() {
        // Kill current file
        if (this._current) {
            if (this._current.file.exists) {
                this._current.file.delete();
            }
        }
        // Build new cookie
        const expires = main_1.Main.opt.expires * 60 * 1000;
        const id = timestamp_1.timestamp(main_1.Main.opt.filenameLength);
        this._res.cookie(main_1.Main.encr(main_1.Main.opt.cookieName), main_1.Main.encr(id), {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + expires),
        });
        // Build new file
        const file = new file_1.File(false, main_1.Main.opt.path, id + '.json');
        // Make file data
        const json = {
            created: new Date(),
            expires: new Date(Date.now() + expires),
            data: null
        };
        // Write data into the file
        const text = JSON.stringify(json, null, '  ');
        file.writeTextSync(main_1.Main.encr(text));
        this._current = new current_1.Current(id, file);
        // Delete the file created
        Manager._tail[id] = this.makeTimeout(file, expires);
    }
    delete() {
        if (!this._current) {
            return;
        }
        // Kill Cookie
        const name = main_1.Main.encr(main_1.Main.opt.cookieName);
        this._res.cookie(name, '', {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            expires: new Date(0),
        });
        // Kill timeout
        const id = this._current.file.name.replace(/\.[^\.]+$/gi, '');
        clearTimeout(Manager._tail[id]);
        delete Manager._tail[id];
        // Fill file
        if (this._current.file.exists) {
            this._current.file.delete();
        }
        // kill session instance
        this._current = undefined;
    }
    rewind(min) {
        if (!this._current) {
            return;
        }
        if (!min) {
            min = main_1.Main.opt.expires;
        }
        // Rebuild cookie
        const id = this._current.id;
        const expires = min * 60 * 1000;
        this._res.cookie(main_1.Main.encr(main_1.Main.opt.cookieName), main_1.Main.encr(id), {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + expires),
        });
        // Remake timeout
        clearTimeout(Manager._tail[id]);
        Manager._tail[id] = this.makeTimeout(this._current.file, expires);
        // Rewrite file
        const data = this._current.read();
        data.expires = new Date(Date.now() + expires);
        this._current.write(data);
    }
    /**
     * Create a new timeout for add to te tail.
     * @param file File instance.
     * @param expires Time in milliseconds
     */
    makeTimeout(file, expires) {
        return setTimeout(() => {
            if ((main_1.Main.opt.callback) &&
                (file.exists)) {
                main_1.Main.opt.callback(this._current.getData());
            }
            else if (main_1.Main.opt.callback) {
                main_1.Main.opt.callback(null);
            }
            if (file.exists) {
                file.delete();
            }
        }, expires);
    }
}
exports.Manager = Manager;
Manager._tail = {};
//# sourceMappingURL=manager.js.map