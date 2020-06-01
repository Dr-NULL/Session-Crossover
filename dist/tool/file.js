"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_sys_1 = require("./file-sys");
const fs = __importStar(require("fs"));
class File extends file_sys_1.FileSys {
    constructor(relative, ...pathSegments) {
        super(relative, ...pathSegments);
    }
    read() {
        return new Promise((resolve, reject) => {
            // Throw Not found file
            if (!this.exists) {
                return reject(new Error("The file doesn't exist."));
            }
            // Get RAW Data
            fs.readFile(this.path, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    readSync() {
        // Throw Not found file
        if (!this.exists) {
            throw new Error("The file doesn't exist.");
        }
        else {
            // Read Data
            return fs.readFileSync(this.path);
        }
    }
    async readText() {
        try {
            const data = await this.read();
            return data.toString('utf-8');
        }
        catch (err) {
            throw (err);
        }
    }
    readTextSync() {
        try {
            const data = this.readSync();
            return data.toString('utf-8');
        }
        catch (err) {
            throw (err);
        }
    }
    writeTextSync(text) {
        try {
            this.makeFolder();
            fs.writeFileSync(this.path, text, { encoding: 'utf-8' });
        }
        catch (err) {
            throw new Error(`Cannot write in the file, probably it's `
                + 'corrupted or requires elevated privileges.');
        }
    }
    makeFolder() {
        const name = this._path.pop();
        super.makeFolder();
        this._path.push(name);
    }
}
exports.File = File;
//# sourceMappingURL=file.js.map