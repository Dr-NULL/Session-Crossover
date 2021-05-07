import { assert } from 'chai';
import { File } from './file';

describe('Testing "./lib/fsys/file"', () => {
    it('Creating a file with the content "hello world"', async () => {
        const file = new File('./test.txt');
        const byte = Buffer.from('hello world', 'utf-8');
        await file.write(byte);
    });

    it('Getting the file stats', async () => {
        const file = new File('./test.txt');
        const stat = await file.stats();

        assert.isTrue(stat.isFile());
    });

    it('Reading the file, and check if it\'s content is "hello world"', async () => {
        const file = new File('./test.txt');
        const byte = await file.read();
        const text = byte.toString('utf-8');

        assert.strictEqual(text, 'hello world');
    });

    it('Coping the current file', async () => {
        const file1 = new File('./test.txt');
        const file2 = await file1.copy('./test1.txt');

        assert.match(file2.path, /(\\|\/)test1\.txt/gi);
    });

    it('Moving the current file', async function() {
        const file = new File('./test.txt');
        await file.move('./test2.txt');

        assert.match(file.path, /(\\|\/)test2\.txt/gi);
    });

    it('Deleting all files', async () => {
        const file1 = new File('./test1.txt');
        await file1.stats();
        await file1.delete();
        
        const file2 = new File('./test2.txt');
        await file2.stats();
        await file2.delete();
    });
});
