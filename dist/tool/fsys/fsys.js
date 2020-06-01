"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fd = __importStar(require("path"));
const fs = __importStar(require("fs"));
class FSys {
    constructor(relative, ...pathSegments) {
        if ((pathSegments.length === 0) &&
            (!relative)) {
            throw new Error('You must specify at least one string for set the path to read in non relative mode.');
        }
        const segm = [];
        for (const item of pathSegments) {
            const subs = item
                .replace(/\\/gi, '/')
                .split(/\//gi);
            segm.push(...subs);
        }
        if (relative) {
            this.path = fd.resolve(...segm);
        }
        else {
            this.path = fd.join(...segm);
        }
    }
    get path() {
        return fd.join(...this._path);
    }
    set path(v) {
        if (!v) {
            throw new Error("Null values isn't allowed.");
        }
        const data = v
            .replace(/\\/gi, '/')
            .split(/\//gi);
        this._path = data;
    }
    get name() {
        const i = this._path.length - 1;
        return this._path[i];
    }
    set name(v) {
        const i = this._path.length - 1;
        this._path[i] = v;
    }
    get exists() {
        return fs.existsSync(this.path);
    }
    get type() {
        if (!this.exists) {
            return 'none';
        }
        const stat = fs.lstatSync(this.path);
        if (stat.isFile()) {
            return 'file';
        }
        else if (stat.isDirectory()) {
            return 'folder';
        }
        else {
            return 'unknown';
        }
    }
    get children() {
        if (this.type === 'folder') {
            const path = fs.readdirSync(this.path);
            const data = [];
            for (const item of path) {
                const file = new FSys(false, this.path, item);
                data.push(file);
            }
            return data;
        }
        else {
            return null;
        }
    }
    resolve(...pathSegments) {
        const text = fd.join(...this._path, ...pathSegments);
        this.path = text;
        return text;
    }
    delete() {
        const kill = (ref) => {
            const type = ref.type;
            if (type === 'folder') {
                // Recursive Iterate children
                for (const file of ref.children) {
                    kill(file);
                }
                fs.rmdirSync(ref.path);
            }
            else if (type === 'file') {
                // Kill File
                fs.unlinkSync(ref.path);
            }
        };
        kill(this);
    }
    makeFolder() {
        if (!this.exists) {
            fs.mkdirSync(this.path, { recursive: true });
        }
    }
}
exports.FSys = FSys;
//# sourceMappingURL=fsys.js.map