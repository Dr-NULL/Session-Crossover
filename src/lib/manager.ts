import { Options } from './interface';
import { Folder } from '../tool/fsys';

export class Manager {
    private _folder: Folder;
    private _options: Options;

    constructor(options: Options) {
        this._options = options;
        this._folder = new Folder(options.folder);

        this._options.folder = this._folder.path;
        
    }
}
