import * as fs from 'fs';

/**
 * Writes a Buffer into a file, if the file doesn't exists, this will be create.
 * By default, the encoding used it's UTF-8.
 * @param path The path of the file.
 * @param byte A Buffer with the content to be write.
 * @param options An optional object with the options for the write operation.
 */
export function writeFile(path: string, byte: Buffer, options?: fs.WriteFileOptions): Promise<void> {
    if (!options) {
        options = { };
    }

    return new Promise((resolve, reject) => {
        fs.writeFile(path, byte, options, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}