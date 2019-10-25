import * as fs from "fs";

export let clearFolder = (path: string) => {
    return new Promise<void>((resolve, reject) => {
        path = path.replace(/\\/gi, "/")
        fs.readdir(path, (err, files) => {
            if (err != null) {
                reject(err)

            } else {
                files.forEach(file => {
                    fs.unlinkSync(`${path}/${file}`)
                })
                resolve()
            }
        })
    })
}