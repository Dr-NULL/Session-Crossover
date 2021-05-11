import * as fs from 'fs';

/**
 * Creates asynchronously a new folder in the desired path.
 * @param path The path of the folder do you want to make.
 * @param options Optional object with aditional parameters fo folder creation.
 * @returns A promise with the current pending operation.
 */
export function mkdir(path: string, options?: fs.MakeDirectoryOptions): Promise<void> {
    if (!options) {
        options = { };
    }

    return new Promise((resolve, reject) => {
        fs.mkdir(path, options, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
