import { Session } from "./interfaces/session";
import { File } from '../tool/file';
import { Json } from "./interfaces/json";
export declare class Current implements Session {
    private _id;
    readonly id: string;
    private _file;
    readonly file: File;
    private _created;
    readonly created: Date;
    private _expires;
    readonly expires: Date;
    constructor(id: string, file: File);
    read(): Json;
    write(obj: Json): void;
    getData(): any;
    setData(data: any): void;
}
//# sourceMappingURL=current.d.ts.map