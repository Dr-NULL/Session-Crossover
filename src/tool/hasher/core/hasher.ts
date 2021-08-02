import { randomBytes } from 'crypto';
import * as Argon2 from 'argon2';
import { Options } from 'argon2';

import { Validation } from './validation';
import { Validator } from '../interface';
import { Hash } from './hash';

/**
 * A class for generate random hashs using Argon2 algorithm.
 */
export class Hasher {
    private _options: Options;

    /**
     * `default = 16;` Gets or sets the length (in bytes) of the hash generated.
     * The range of values accepted are between `1` to `255`.
     */
    public get hashLength(): number {
        return this._options.hashLength;
    }
    public set hashLength(v: number) {
        if (v < 1 || v > 255) {
            throw new Error(
                'The value given it\'s out of range. The range of values are between 1 - 255.'
            );
        }

        this._options.hashLength = Math.trunc(v);
    }

    /**
     * Gets or sets the salt to be user to generate hashes. If you set a custom salt, the `saltLength`
     * will be adjusted using the length of the salt given too.
     */
    public get salt(): Buffer {
        return this._options.salt;
    }
    public set salt(v: Buffer) {
        this._options.salt = v;
        this._options.saltLength = v.length;
    }

    /**
     * `default = 16;` Gets or sets the length (in bytes) of the salt generated.
     * The range of values accepted are between `1` to `255`.
     */
    public get saltLength(): number {
        return this._options.saltLength;
    }

    /**
     * The amount of threads to compute the hash on. Each thread has a memory pool with `memoryCost`
     * size. Note that changing it also changes the resulting hash.
     * 
     * The default value is `1`, meaning a single thread is used.
     */
    public get parallelism() : number {
        return this._options.parallelism;
    }
    public set parallelism(v : number) {
        this._options.parallelism = v;
    }

    /**
     * The amount of memory to be used by the hash function, in KiB. Each thread *(see parallelism)* will
     * have a memory pool of this size. Note that large values for highly concurrent usage will cause
     * starvation and thrashing if your system memory gets full.
     *
     * The default value is `4096`, meaning a pool of 4 MiB per thread.
     */
    public get memoryCost() : number {
        return this._options.memoryCost;
    }
    public set memoryCost(v : number) {
        this._options.memoryCost = v;
    }
    

    /**
     * Create a new instance of Hasher.
     */
    public constructor() {
        this._options = {
            parallelism: 1,
            memoryCost: 4096,
            hashLength: 16,
            saltLength: 16
        };
    }

    /**
     * Generates a new salt randomly.
     * @param length The salt length desired.
     */
    createRndSalt(length: number): void {
        if (length < 1 || length > 255) {
            throw new Error(
                'The value given it\'s out of range. The range of values are between 1 - 255.'
            );
        }

        length = Math.trunc(length);
        this._options.salt = Buffer.from(randomBytes(length));
        this._options.saltLength = length;
    }

    /**
     * Converts the input value into a Buffer. 
     * @param input the input that will used to be converted into a Buffer.
     */
    private toBuffer(input: string | number | Buffer): Buffer {
        if (typeof input === 'string') {
            return Buffer.from(input);
        } else if (typeof input === 'number') {
            return Buffer.from(input.toString());
        } else {
            return input;
        }
    }

    /**
     * Hashes an input value, and return an instance with the output hash and salt buffer manager.
     * @param value the input value do you want to hash.
     */
    public async hash(value: string | number | Buffer) {
        const salt = this._options.salt ?? randomBytes(this._options.saltLength);
        value = this.toBuffer(value);

        const opts: Options & { raw: true } = { salt: salt, raw: true };
        Object.assign(opts, this._options);

        const byte = await Argon2.hash(value as Buffer,  opts);
        return new Hash(byte, salt);
    }

    /**
     * Get a new Validator of hashes using the current Hasher configuration.
     */
    getValidator(): Validator {
        return new Validation(this._options);
    }
}