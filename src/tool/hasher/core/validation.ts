import * as Argon2 from 'argon2';
import { Options } from 'argon2';

import { Validator } from '../interface/validator';
import { toBuffer } from './to-buffer';
import { Hash } from './hash';

export class Validation implements Validator {
    private _cache: string;
    private _options: Options & { raw: false; };

    public constructor(options: Options) {
        this._options = { raw: false };
        Object.assign(this._options, options);
    }

    async validate(
        hash: string | Hash,
        value: string | number | Buffer
    ): Promise<boolean> {
        // Converts the arguments
        value = toBuffer(value);
        if (!(hash instanceof Hash)) {
            hash = Hash.fromHexString(hash);
        }

        // Generate cache
        if (!this._cache) {
            this._cache = await Argon2.hash(
                value as Buffer,
                this._options
            );

            this._cache = this._cache
                .replace(/(\$[^\$]+){2}$/gi, '');
        }

        // Stringify hash to Base64
        let strHash = this._cache + '$';
        strHash += hash.salt.toString('base64').replace(/=+$/gi, '');
        strHash += '$';
        strHash += hash.hash.toString('base64').replace(/=+$/gi, '');

        // Return response
        return Argon2.verify(
            strHash, value,
            this._options
        );
    }
}