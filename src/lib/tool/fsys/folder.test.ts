import { Folder } from './folder';

describe.only('Testing "./lib/fsys/folder"', () => {
    it('Read content', async () => {
        const folder = new Folder('.');
        const children = await folder.content();

        console.log(children);
    });
});
