import { Session } from "./interfaces/session";
import { File } from '../tool/file';
export declare class Current implements Session {
    private _file;
    readonly file: File;
    private _created;
    readonly created: Date;
    private _expires;
    readonly expires: Date;
    constructor(file: File);
    private read;
    getData(): any;
    setData(data: any): void;
}
//# sourceMappingURL=current.d.ts.map