import { FileSys } from './file-sys';
import * as fs from 'fs';

export class File extends FileSys {
  public constructor(relative: boolean, ...pathSegments: string[]) {
    super(relative, ...pathSegments)
  }

  read() {
    return new Promise<Buffer>((resolve, reject) => {
      // Throw Not found file
      if (!this.exists) {
        return reject(new Error("The file doesn't exist."))
      }

      // Get RAW Data
      fs.readFile(this.path, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  readSync() {
    // Throw Not found file
    if (!this.exists) {
      throw new Error("The file doesn't exist.")
    } else {
      // Read Data
      return fs.readFileSync(this.path)
    }
  }

  async readText() {
    try {
      const data = await this.read()
      return data.toString('utf-8')
    } catch (err) {
      throw (err)
    }
  }

  readTextSync() {
    try {
      const data = this.readSync()
      return data.toString('utf-8')
    } catch (err) {
      throw (err)
    }
  }

  writeTextSync(text: string) {
    try {
      this.makeFolder()
      fs.writeFileSync(this.path, text, { encoding: 'utf-8' })
    } catch (err) {
      throw new Error(
          `Cannot write in the file, probably it's `
        + 'corrupted or requires elevated privileges.'
      )
    }
  }

  public makeFolder() {
    const name = this._path.pop()
    super.makeFolder()
    this._path.push(name)
  }
}