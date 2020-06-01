import { Session } from "./interfaces/session";
import { Main } from './main';
import { File } from '../tool/file';
import { Json } from "./interfaces/json";

export class Current implements Session {
  private _file: File;
  public get file(): File {
    return this._file;
  }

  private _created: Date;
  public get created(): Date {
    return this._created
  }

  private _expires: Date;
  public get expires(): Date {
    return this._expires
  }

  public constructor(file: File) {
    this._file = file
    const json = this.read()

    this._created = new Date(json.created)
    this._expires = new Date(json.expires)
  }

  private read() {
    const text = this._file.readTextSync()
    const json: Json = JSON.parse(Main.decr(text))
    return json
  }

  public getData() {
    const json = this.read()
    return json.data
  }

  public setData(data: any) {
    const json = this.read()
    json.data = data

    const text = JSON.stringify(json, null, '  ')
    this._file.writeTextSync(Main.encr(text))
  }
}