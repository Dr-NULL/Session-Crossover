import * as fs from 'fs';

/**
 * Implementation of `rm` command.
 * @param path The path of the element do you want to delete.
 * @returns A promise resolving the deletion.
 */
export function rm(path: string, options?: fs.RmOptions): Promise<void> {
    if (!options) {
        options = { };
    }

    return new Promise((resolve, reject) => {
        fs.rm(path, options, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
