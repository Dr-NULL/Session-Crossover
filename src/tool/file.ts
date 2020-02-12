import * as fs from "fs";

export class File{
    private _name : string;
    public get name() : string {
        return this._name;
    }
    public set name(v : string) {
        v = v.replace(/^(\\|\/)+/gi, "")

        fs.renameSync(
            this._folder + this._name,
            this._folder + v
        )

        this._name = v;
    }

    private _folder : string;
    public get folder() : string {
        return this._folder;
    }
    public set folder(v : string) {
        v = v.replace(/\\/gi, "/")
        v = v.replace(/\/+$/gi, "")
        v = v + "/"

        //Crear carpeta si es que no existe
        if (!fs.existsSync(v)) {
            fs.mkdirSync(v, { recursive: true })
        }

        //Copiar a Destino
        fs.copyFileSync(
            this._folder + this._name,
            v + this._name
        )

        //Eliminar de origen
        fs.unlinkSync(
            this._folder + this._name
        )

        this._folder = v;
    }

    public get fullPath(): string {
        return this._folder + this._name
    }

    public get exist(): boolean {
        return fs.existsSync(this.fullPath)
    }

    public constructor(path: string) {
        //Get folder and filename
        let tmp = path.replace(/(\\|\/)(.(?!(\\|\/)))+.$/gi, "")

        this._folder = tmp + "/"
        this._folder = this.folder.replace(/^(\\|\/)+/gi, "/")
        this._name = path.replace(tmp, "")
        this._name = this._name.replace(/^(\\|\/)+/gi, "")
    }

    public new(){
        if (this.exist) {
            //Borrar archivo actual
            fs.unlinkSync(this.fullPath)
        }

        this.createFolder()
        fs.writeFileSync(this.fullPath, "", { encoding: "utf8" })
    }

    public read() {
        return new Promise<Buffer>((resolve, reject) => {
            fs.readFile(this.fullPath, (fail, data) => {
                if (fail != null) {
                    reject(`No es posible leer el archivo.\nPath = "${this.fullPath}"`)
                } else {
                    resolve(data)
                }
            })
        })
    }

    public readSync() {
        try {
            return fs.readFileSync(this.fullPath)
        } catch {
            throw "No es posible leer el archivo."
        }
    }

    public readText() {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(this.fullPath, (fail, data) => {
                if (fail != null) {
                    reject(`No es posible leer el archivo.\nPath = "${this.fullPath}"`)
                } else {
                    resolve(data.toString("utf8"))
                }
            })
        })
    }

    public readTextSync() {
        try {
            return fs.readFileSync(this.fullPath).toString("utf8")
        } catch {
            throw `No es posible leer el archivo.\nPath = "${this.fullPath}"`
        }
    }

    public write(data: Buffer){
        return new Promise<void>((resolve, reject) => {
            this.createFolder()
            fs.writeFile(this.fullPath, data, fail => {
                if (fail != null) {
                    reject(`No es posible escribir el archivo.\nPath = "${this.fullPath}"`)
                } else {
                    resolve()
                }
            })
        })
    }

    public writeSync(data: Buffer) {
        try {
            this.createFolder()
            fs.writeFileSync(this.fullPath, data)
        } catch (err) {
            throw `No es posible escribir el archivo.\nPath = "${this.fullPath}"`
        }
    }

    public writeText(data: string){
        return new Promise<void>((resolve, reject) => {
            this.createFolder()
            fs.writeFile(this.fullPath, data, { encoding: "utf8" }, fail => {
                if (fail != null) {
                    reject(`No es posible escribir el archivo.\nPath = "${this.fullPath}"`)
                } else {
                    resolve()
                }
            })
        })
    }

    public writeTextSync(data: string) {
        try {
            this.createFolder()
            fs.writeFileSync(this.fullPath, data, { encoding: "utf8" })
        } catch {
            throw `No es posible escribir el archivo.\nPath = "${this.fullPath}"`
        }
    }

    public kill() {
        try {
            fs.unlinkSync(this.fullPath)
        } catch {
            throw `No es posible eliminar el archivo.\nPath = "${this.fullPath}"`
        }
    }

    private createFolder() {
        if (!fs.existsSync(this.folder)) {
            fs.mkdirSync(this.folder)
        }
    }
}
