import * as fs from 'fs';

/**
 * Reads the file, and returns a buffer with its content.
 * @param path The path of the element.
 * @returns The Buffer containing the content of the file.
 */
export function readFile(path: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, byte) => {
            if (err) {
                reject(err);
            } else {
                resolve(byte);
            }
        });
    });
}