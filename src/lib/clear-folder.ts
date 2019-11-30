import * as fs from "fs";

export let clearFolder = (path: string) => {
    return new Promise<void>(resolve => {
        path = path.replace(/\\/gi, "/")
        fs.readdir(path, (err, files) => {
            if (err != null) {
                fs.mkdirSync(path, { recursive: true })
            }

            if (files != undefined) {
                files.forEach(file => {
                    fs.unlinkSync(`${path}/${file}`)
                })
                resolve()
            }
        })
    })
}