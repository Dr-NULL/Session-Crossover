import { assert } from 'chai';

import { Folder } from '../tool/fsys';
import { Queue } from './queue';

interface Data {
    id: number;
    nick: string;
}

class FolderTest extends Folder {
    async someFile(name: string): Promise<boolean> {
        const children = await this.children();
        return children.files.some(x => x.name === `${name}.json`);
    }
    
    async cantFiles(): Promise<number> {
        const children = await this.children();
        return children.files.length;
    }
}

function delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

describe('Testing "./lib/queue"', () => {
    const folder = new FolderTest('./test');
    beforeEach(async () => {
        await folder.make();
    });

    afterEach(async () => {
        await folder.delete();
    });

    it('New Queue: 1 session; 1990ms', async () => {
        const queue = new Queue<Data>({
            path: './test',
            expires: 1990
        });

        const elem = await queue.new();
        elem.save({
            id: 666,
            nick: 'wold'
        });

        await delay(500);
        assert.isTrue(queue.some(elem.hash));
        assert.isTrue(await folder.someFile(elem.hash));

        await delay(1550);
        assert.isFalse(queue.some(elem.hash));
        assert.isFalse(await folder.someFile(elem.hash));
    }).timeout(2100);

    it('New Queue: 2 session; 1500ms', async () => {
        const queue = new Queue<Data>({
            path: './test',
            expires: 1500
        });

        const objA = await queue.new();
        objA.save({
            id: 666,
            nick: 'wold'
        });

        await delay(500);
        assert.isTrue(queue.some(objA.hash));
        assert.isTrue(await folder.someFile(objA.hash));
        assert.strictEqual(await folder.cantFiles(), 1);

        const objB = await queue.new();
        objB.save({
            id: 999,
            nick: 'the angelic process'
        });

        await delay(500);
        assert.isTrue(queue.some(objA.hash));
        assert.isTrue(queue.some(objB.hash));
        assert.isTrue(await folder.someFile(objA.hash));
        assert.isTrue(await folder.someFile(objB.hash));
        assert.strictEqual(await folder.cantFiles(), 2);

        await delay(1050);
        assert.isFalse(queue.some(objA.hash));
        assert.isFalse(queue.some(objB.hash));
        assert.isFalse(await folder.someFile(objA.hash));
        assert.isFalse(await folder.someFile(objB.hash));
        assert.strictEqual(await folder.cantFiles(), 0);
    }).timeout(2100);
});
