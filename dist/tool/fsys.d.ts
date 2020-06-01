declare type type = 'file' | 'folder' | 'unknown' | 'none';
export declare class FSys {
    protected _path: string[];
    path: string;
    name: string;
    readonly exists: boolean;
    readonly type: type;
    readonly children: FSys[];
    constructor(relative: boolean, ...pathSegments: string[]);
    resolve(...pathSegments: string[]): string;
    delete(): void;
    makeFolder(): void;
}
export {};
//# sourceMappingURL=fsys.d.ts.map