import * as fs from 'fs';

/**
 * Copies the current element into the destination path.
 * @param pathOrigin Parts of the element of origin.
 * @param pathDest Parts of the destination of origin.
 * @returns A promise resolving the operation.
 */
export function copyFile(pathOrigin: string, pathDest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.copyFile(pathOrigin, pathDest, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}