import { File } from './file';
import { Folder } from './folder';

export interface FolderChildren {
    folders: Folder[];
    files: File[];
}
