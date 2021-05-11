import { assert } from 'chai';
import { resolve } from 'path';
import * as Wrapper from './fs-wrappers';

import { File } from './file';

describe('Testing "./tool/fsys/file"', () => {
    before(async ()=> {
        const path = resolve('./data-test');
        await Wrapper.mkdir(path);
    });

    after(async ()=> {
        const path = resolve('./data-test');
        await Wrapper.rm(path, { recursive: true });
    });

    it('Create a new file with "hello world"', async () => {
        const file = new File('./data-test/test.txt');
        const byte = Buffer.from('hello world', 'utf-8');
        await file.write(byte);
    });

    it('Read the file content', async () => {
        const file = new File('./data-test/test.txt');
        const byte = await file.read();
        const text = byte.toString('utf-8');

        assert.strictEqual(text, 'hello world');
    });

    it('Rename this file to "test-copy.txt"', async () => {
        const file = new File('./data-test/test.txt');
        await file.rename('test-copy.txt');

        assert.strictEqual(file.name, 'test-copy.txt');
    });

    it('Clone 5 times the file', async () => {
        const file = new File('./data-test/test-copy.txt');
        for (let i = 1; i <= 5; i++) {
            const other = await file.copy(`./data-test/test${i}.txt`);
            assert.strictEqual(other.name, `test${i}.txt`);
        }
    });

    it('Delete "test-copy.txt"', async () => {
        const file = new File('./data-test/test-copy.txt');
        await file.delete();
    });
});
