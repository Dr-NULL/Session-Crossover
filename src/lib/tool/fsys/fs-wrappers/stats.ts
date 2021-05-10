import * as fs from 'fs';

/**
 * Gets the stats of a file or folder.
 * @param path The path of the element.
 * @returns A promise with the stats of the requested element.
 */
export function stats(path: string): Promise<fs.Stats>
/**
 * Gets the stats of a file or folder.
 * @param path The path of the element.
 * @param bigInt If `true`, returns a BigIntStats instance,
 * elsewhere returns a Stats instance.
 * @returns A promise with the stats of the requested element.
 */
export function stats(path: string, bigInt: false): Promise<fs.Stats>
/**
 * Gets the stats of a file or folder.
 * @param path The path of the element.
 * @param bigInt If `true`, returns a BigIntStats instance,
 * elsewhere returns a Stats instance.
 * @returns A promise with the stats of the requested element.
 */
export function stats(path: string, bigInt: true): Promise<fs.BigIntStats>
/**
 * Gets the stats of a file or folder.
 * @param path The path of the element.
 * @param bigInt If `true`, returns a BigIntStats instance,
 * elsewhere returns a Stats instance.
 * @returns A promise with the stats of the requested element.
 */
export function stats(path: string, bigInt?: boolean): Promise<fs.Stats | fs.BigIntStats>
export function stats(path: string, bigInt?: boolean): Promise<fs.Stats | fs.BigIntStats> {
    const opt: fs.StatOptions = {
        bigint: bigInt
    };

    return new Promise((resolve, reject) => {
        fs.stat(path, opt, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                resolve(stats);
            }
        });
    });
}
