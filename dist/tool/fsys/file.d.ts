/// <reference types="node" />
import { FSys } from '.';
export declare class File extends FSys {
    constructor(relative: boolean, ...pathSegments: string[]);
    read(): Promise<Buffer>;
    readSync(): Buffer;
    readText(): Promise<string>;
    readTextSync(): string;
    writeTextSync(text: string): void;
}
//# sourceMappingURL=file.d.ts.map