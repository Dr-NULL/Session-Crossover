import * as fs from 'fs';

/**
 * Deletes a file in the specified path.
 * @param path The path of the element do you want to delete.
 * @returns A promise resolving the deletion.
 */
export function unlink(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.unlink(path, fail => {
            if (fail) {
                reject(fail);
            } else {
                resolve();
            }
        });
    });
}
