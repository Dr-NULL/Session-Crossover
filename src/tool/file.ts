import * as fs from "fs"

export class File {
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
    public get fullPathUrl(): string {
        let url = this._folder + this._name
        url = url.replace(/\\/gi, "/")
        url = url.replace(/^\//gi, "")
        url = "file:///" + url

        return url
    }
    
    constructor(path: string) {
        //Get folder and filename
        let tmp = path.replace(/(\\|\/)(.(?!(\\|\/)))+.$/gi, "")

        this._folder = tmp + "/"
        this._name = path.replace(tmp, "")
        this._name = this._name.replace(/^(\\|\/)+/gi, "")
    }

    public get exists() {
        return new Promise<boolean>((resolve, reject) => {
            fs.access(this.fullPath, (err) => {
                if (err != null) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }

    public get existsSync() {
        try {
            fs.accessSync(this.fullPath)
            return true
        } catch {
            return false
        }
    }

    public read() {
        return new Promise<string>(async(resolve, reject) => {
            fs.readFile(this.fullPath, (fail, data) => {
                if (fail == null) {
                    resolve(data.toString("utf-8"))
                } else {
                    reject()
                }
            })
        })
    }


    public readSync() {
        return fs.readFileSync(this.fullPath, {
            encoding: "utf8"
        })
    }

    public write(data: string) {
        return new Promise<void>(async (resolve, reject) => {
            let write = () => {
                fs.writeFile(this.fullPath, data, { encoding: "utf8" }, (fail) => {
                    if (fail == null) {
                        resolve()
                    } else {
                        reject()
                    }
                })
            }

            fs.access(this._folder, err => {
                if (err != null) {
                    fs.mkdir(this._folder, () => {
                        write()
                    })
                } else {
                    write()
                }
            })

        })
    }

    public writeSync(data: string) {
        //Testing the path
        try {
            fs.accessSync(this._folder)
        } catch {
            fs.mkdirSync(this._folder)
        }

        fs.writeFileSync(this.fullPath, data, {
            encoding: "utf8",
            flag: "w"
        })
    }

    public kill() {
        //Eliminar de origen
        fs.unlinkSync(
            this._folder + this._name
        )
    }
}
export default File