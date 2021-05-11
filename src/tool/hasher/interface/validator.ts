import { Hash } from '../core/hash';

export interface Validator {
    validate: (
        hash: string | Hash,
        value: string | number | Buffer
    ) => Promise<boolean>;
}