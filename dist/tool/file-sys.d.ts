declare type type = 'file' | 'folder' | 'unknown' | 'none';
export declare class FileSys {
    protected _path: string[];
    path: string;
    name: string;
    readonly exists: boolean;
    readonly type: type;
    readonly children: FileSys[];
    constructor(relative: boolean, ...pathSegments: string[]);
    resolve(...pathSegments: string[]): string;
    delete(): void;
    makeFolder(): void;
}
export {};
//# sourceMappingURL=file-sys.d.ts.map