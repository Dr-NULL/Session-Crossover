import * as fs from 'fs';

/**
 * Lists all folders/files name inside of a folder.
 * @param path The path of the folder to watch.
 * @returns A promise with all element names inside of the folder.
 */
export function readDir(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, names) => {
            if (err) {
                reject(err);
            } else {
                resolve(names);
            }
        });
    });
}
