import { File } from './file';
import { Folder } from './folder';

export interface FolderContent {
    folders: Folder[];
    files: File[];
}
