/// <reference types="node" />
import { CipherGCMTypes, CipherCCMTypes } from 'crypto';
interface AESAuth {
    key: number[];
    iv: number[];
}
export declare class AESCrypto implements AESAuth {
    key: number[];
    iv: number[];
    private _type;
    readonly type: CipherGCMTypes | CipherCCMTypes;
    constructor(type: CipherGCMTypes | CipherCCMTypes, password?: string);
    generate(): string;
    encrypt(text: string): string;
    decrypt(text: string): string;
}
export {};
//# sourceMappingURL=aes-crypto.d.ts.map