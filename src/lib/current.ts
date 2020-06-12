import { Session } from "./interfaces/session";
import { Main } from './main';
import { File } from '../tool/file';
import { Json } from "./interfaces/json";

export class Current implements Session {
  private _id : string;
  public get id() : string {
    return this._id;
  }

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

  public constructor(id: string, file: File) {
    this._id = id
    this._file = file
    const json = this.read()

    this._created = new Date(json.created)
    this._expires = new Date(json.expires)
  }

  public read() {
    if (this._file.exists) {
      const text = this._file.readTextSync()
      const json: Json = JSON.parse(Main.decr(text))
      return json
    } else {
      return null
    }
  }

  public write(obj: Json) {
    const text = JSON.stringify(obj, null, '  ')
    if (this._file.exists) {
      this._file.writeTextSync(Main.encr(text))
    }
  }

  public getData() {
    const json = this.read()
    return json.data
  }

  public setData(data: any) {
    const json = this.read()
    json.data = data
    this.write(json)
  }
}