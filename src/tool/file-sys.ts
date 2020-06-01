import * as fd from 'path';
import * as fs from 'fs';

type type = 'file' | 'folder' | 'unknown' | 'none';

export class FileSys {
  protected _path: string[];
  public get path(): string {
    return fd.join(...this._path)
  }
  public set path(v: string) {
    if (!v) {
      throw new Error("Null values isn't allowed.")
    }

    const data = v
      .replace(/\\/gi, '/')
      .split(/\//gi)

    this._path = data
  }

  public get name(): string {
    const i = this._path.length - 1
    return this._path[i]
  }
  public set name(v: string) {
    const i = this._path.length - 1
    this._path[i] = v
  }

  public get exists() {
    return fs.existsSync(this.path)
  }

  public get type(): type {
    if (!this.exists) {
      return 'none'
    }

    const stat = fs.lstatSync(this.path)
    if (stat.isFile()) {
      return 'file'
    } else  if (stat.isDirectory()) {
      return 'folder'
    } else {
      return 'unknown'
    }
  }

  public get children(): FileSys[] {
    if (this.type === 'folder') {
      const path = fs.readdirSync(this.path)
      const data: FileSys[] = []

      for (const item of path) {
        const file = new FileSys(false, this.path, item)
        data.push(file)
      }
      
      return data
    } else {
      return null
    }
  }

  public constructor(relative: boolean, ...pathSegments: string[]) {
    if (
      (pathSegments.length === 0) &&
      (!relative)
    ) {
      throw new Error('You must specify at least one string for set the path to read in non relative mode.')
    }

    const segm: string[] = []
    for (const item of pathSegments) {
      const subs = item
        .replace(/\\/gi, '/')
        .split(/\//gi)

      segm.push(...subs)
    }

    if (relative) {
      this.path = fd.resolve(...segm)
    } else {
      this.path = fd.join(...segm)
    }
  }

  public resolve(...pathSegments: string[]) {
    const text = fd.join(...this._path, ...pathSegments)
    this.path = text
    return text
  }

  public delete() {
    const kill = (ref: FileSys) => {
      const type = ref.type
      if (type === 'folder') {
        // Recursive Iterate children
        for (const file of ref.children) {
          kill(file)
        }
        fs.rmdirSync(ref.path)
      } else if (type === 'file') {
        // Kill File
        fs.unlinkSync(ref.path)
      }
    }

    kill(this)
  }

  public makeFolder() {
    if (!this.exists) {
      fs.mkdirSync(this.path, { recursive: true })
    }
  }


}