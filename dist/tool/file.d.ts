/// <reference types="node" />
import { FileSys } from './file-sys';
export declare class File extends FileSys {
    constructor(relative: boolean, ...pathSegments: string[]);
    read(): Promise<Buffer>;
    readSync(): Buffer;
    readText(): Promise<string>;
    readTextSync(): string;
    writeTextSync(text: string): void;
    makeFolder(): void;
}
//# sourceMappingURL=file.d.ts.map