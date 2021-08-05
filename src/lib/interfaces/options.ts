import { AESAlgorithm } from '../../tool/aes-crypto/interfaces';

export interface Options {
    path: string;
    name?: string;
    maxAge?: number;
    cipherAlgorithm?: AESAlgorithm;
}