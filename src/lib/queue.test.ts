import { assert } from 'chai';

import { CurrentSession } from './current-session';
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
    before(async () => {
        await folder.make();
    });

    after(async () => {
        await folder.delete();
    });

    it('New Queue: 1 session; 2000ms for each', async () => {
        const queue = new Queue({
            path: './test',
            expires: 2000
        });

        const elem = await queue.new();
        elem.save({
            id: 666,
            nick: 'wold'
        });

        await delay(500);
        assert.isTrue(queue.some(elem.hash));
        assert.isTrue(await folder.someFile(elem.hash));

        await delay(1525);
        assert.isFalse(queue.some(elem.hash));
        assert.isFalse(await folder.someFile(elem.hash));
    }).timeout(2200);

    it('New Queue: 2 session; 1500ms for each', async () => {
        const queue = new Queue({
            path: './test',
            expires: 1500
        });

        let objA: CurrentSession<Data>;
        setTimeout(async () => {
            objA = await queue.new();
            await objA.save({
                id: 666,
                nick: 'the angelic process'
            });
        }, 0);

        let objB: CurrentSession<Data>;
        setTimeout(async () => {
            objB = await queue.new();
            await objB.save({
                id: 999,
                nick: 'el lago de las orquídeas en llamas'
            });
        }, 500);

        await delay(500);
        assert.isTrue(queue.some(objA.hash));
        assert.isTrue(await folder.someFile(objA.hash));
        assert.strictEqual(await folder.cantFiles(), 1);

        await delay(500);
        assert.isTrue(queue.some(objA.hash));
        assert.isTrue(queue.some(objB.hash));
        assert.isTrue(await folder.someFile(objA.hash));
        assert.isTrue(await folder.someFile(objB.hash));
        assert.strictEqual(await folder.cantFiles(), 2);

        await delay(1025);
        assert.isFalse(queue.some(objA.hash));
        assert.isFalse(queue.some(objB.hash));
        assert.isFalse(await folder.someFile(objA.hash));
        assert.isFalse(await folder.someFile(objB.hash));
        assert.strictEqual(await folder.cantFiles(), 0);
    }).timeout(2200);

    it('New Queue: 3 session; 1000ms for each', async () => {
        let id = 83;
        const queue = new Queue({
            path: './test',
            expires: 1000
        });

        let objA: CurrentSession<Data>;
        setTimeout(async () => {
            objA = await queue.new();
            await objA.save({
                id: ++id,
                nick: 'pendejo-1'
            });
        }, 0);

        let objB: CurrentSession<Data>;
        setTimeout(async () => {
            objB = await queue.new();
            await objB.save({
                id: ++id,
                nick: 'pendejo-2'
            });
        }, 500);

        let objC: CurrentSession<Data>;
        setTimeout(async () => {
            objC = await queue.new();
            await objC.save({
                id: ++id,
                nick: 'pendejo-3'
            });
        }, 1000);
        
        await delay(2025);
        assert.isFalse(queue.some(objA.hash));
        assert.isFalse(queue.some(objB.hash));
        assert.isFalse(queue.some(objC.hash));
        assert.isFalse(await folder.someFile(objA.hash));
        assert.isFalse(await folder.someFile(objB.hash));
        assert.isFalse(await folder.someFile(objC.hash));
        assert.strictEqual(await folder.cantFiles(), 0);
    }).timeout(2200);
});
