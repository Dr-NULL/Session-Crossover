import { join } from 'path';
import { assert } from 'chai';
import * as Wrapper from './fs-wrappers';

import { Folder } from './folder';

describe('Testing "./tool/fsys/folder"', () => {
    after(async () => {
        await Wrapper.rm('./data-test-other', { recursive: true });
    });

    it('Create a new Folder', async () => {
        const folder = new Folder('./data-test');
        await folder.make();
    });

    it('Create files inside', async () => {
        const folder1 = new Folder('./data-test');
        const byte = Buffer.from('hello world', 'utf-8');

        for (let i = 0; i < 3; i++) {
            const path = join(folder1.path, `file-test-${i}.txt`);
            await Wrapper.writeFile(path, byte);
        }

        const folder2 = new Folder('./data-test/inside');
        await folder2.make();
        for (let i = 0; i < 3; i++) {
            const path = join(folder2.path, `file-test-${i}.txt`);
            await Wrapper.writeFile(path, byte);
        }

        const folder3 = new Folder('./data-test/inside/alt1');
        await folder3.make();
        for (let i = 0; i < 3; i++) {
            const path = join(folder3.path, `file-test-${i}.txt`);
            await Wrapper.writeFile(path, byte);
        }

        const folder4 = new Folder('./data-test/inside/alt2');
        await folder4.make();
        for (let i = 0; i < 3; i++) {
            const path = join(folder4.path, `file-test-${i}.txt`);
            await Wrapper.writeFile(path, byte);
        }
    });

    it('Copy folder', async () => {
        const folder1 = new Folder('./data-test');
        const folder2 = await folder1.copy('./data-test-copy');

        let children = await folder2.children();
        assert.strictEqual(children.files.length, 3);
        children.files.forEach((x, i) => {
            assert.strictEqual(x.name, `file-test-${i}.txt`);
        });

        assert.strictEqual(children.folders.length, 1);
        children = await children.folders[0].children();
        assert.strictEqual(children.files.length, 3);
        children.files.forEach((x, i) => {
            assert.strictEqual(x.name, `file-test-${i}.txt`);
        });

        assert.strictEqual(children.folders.length, 2);
        children.folders.forEach(async (folder, i) => {
            assert.strictEqual(folder.name, `alt${i}`);
            const inner = await folder.children();

            assert.strictEqual(inner.folders.length, 0);
            assert.strictEqual(inner.files.length, 3);

            inner.files.forEach((x, l) => {
                assert.strictEqual(x.name, `file-test-${l}.txt`);
            });
        });
    });

    it('Delete original folder', async () => {
        const folder = new Folder('./data-test');
        await folder.delete();

        const exist = await folder.exists();
        assert.isFalse(exist);
    });

    it('Move folder', async () => {
        const folder = new Folder('./data-test-copy');
        await folder.move('./data-test-other');
        assert.strictEqual(folder.name, 'data-test-other');
        
        const backup = new Folder('./data-test-copy');
        const existOld = await backup.exists();
        const existNew = await folder.exists();
        assert.isFalse(existOld);
        assert.isTrue(existNew);
    });
});
