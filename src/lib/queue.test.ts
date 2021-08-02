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
        assert.isTrue(queue.some(elem.uuid));
        assert.isTrue(await folder.someFile(elem.uuid));

        await delay(1525);
        assert.isFalse(queue.some(elem.uuid));
        assert.isFalse(await folder.someFile(elem.uuid));
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
            
            assert.isTrue(queue.some(objA.uuid));
            assert.isTrue(await folder.someFile(objA.uuid));
            assert.strictEqual(await folder.cantFiles(), 1);
        }, 0);

        let objB: CurrentSession<Data>;
        setTimeout(async () => {
            objB = await queue.new();
            await objB.save({
                id: 999,
                nick: 'el lago de las orquídeas en llamas'
            });
            
            assert.isTrue(queue.some(objA.uuid));
            assert.isTrue(queue.some(objB.uuid));
            assert.isTrue(await folder.someFile(objA.uuid));
            assert.isTrue(await folder.someFile(objB.uuid));
            assert.strictEqual(await folder.cantFiles(), 2);
        }, 500);

        await delay(2010);
        assert.isFalse(queue.some(objA.uuid));
        assert.isFalse(queue.some(objB.uuid));
        assert.isFalse(await folder.someFile(objA.uuid));
        assert.isFalse(await folder.someFile(objB.uuid));
        assert.strictEqual(await folder.cantFiles(), 0);
    }).timeout(2150);

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
        assert.isFalse(queue.some(objA.uuid));
        assert.isFalse(queue.some(objB.uuid));
        assert.isFalse(queue.some(objC.uuid));
        assert.isFalse(await folder.someFile(objA.uuid));
        assert.isFalse(await folder.someFile(objB.uuid));
        assert.isFalse(await folder.someFile(objC.uuid));
        assert.strictEqual(await folder.cantFiles(), 0);
    }).timeout(2250);
});
