import * as Wrapper from '.';
import { resolve } from 'path';
import { assert } from 'chai';

describe('Testing "./lib/tool/fsys/fs-wrappers"', () => {
    it('Create a new folder (recursive)', async () => {
        const path = resolve('./test-fsys/inside');
        await Wrapper.mkdir(path, { recursive: true });
    });

    it('Create a new file', async () => {
        const path = resolve('./test-fsys/file.txt');
        const byte = Buffer.from('hello world', 'utf-8');
        await Wrapper.writeFile(path, byte);
    });

    it('Copy the file', async () => {
        const pathOrigin = resolve('./test-fsys/file.txt');
        for (let i = 1; i <= 3; i++) {
            const pathDest = resolve(`./test-fsys/inside/file${i}.txt`);
            await Wrapper.copyFile(pathOrigin, pathDest);
        }
    });

    it('Read the file', async () => {
        const path = resolve('./test-fsys/file.txt');
        const byte = await Wrapper.readFile(path);
        const text = byte.toString('utf-8');

        assert.strictEqual(text, 'hello world');
    });

    it('Read "./test-fsys/inside/" file names', async () => {
        const path = resolve('./test-fsys/inside');
        const names = await Wrapper.readDir(path);

        assert.sameOrderedMembers(names, [
            'file1.txt',
            'file2.txt',
            'file3.txt',
        ]);
    });

    it('Delete all', async () => {
        await Wrapper.unlink(resolve(`./test-fsys/file.txt`));
        await Wrapper.rm(resolve(`./test-fsys`), { force: true, recursive: true });
    });
});
