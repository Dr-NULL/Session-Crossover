import { CurrentSession } from './current-session';
import { File, Folder } from '../tool/fsys';
import { assert } from 'chai';

interface Data {
    text: string;
    value: number;
}

describe.only('Testing "./current-session"', () => {
    const folder = new Folder('./test');
    before(async () => {
        await folder.make();
    });

    after(async () => {
        await folder.delete();
    });

    it('Create a new session: "aaaaa"', () => {
        return new Promise<void>(async resolve => {
            // Create the session value
            const curr = new CurrentSession<Data>('aaaaa', 2000, folder.path);
            const file = new File(`${folder.path}/${curr.hash}.json`);

            // Save current value
            curr.value = {
                text: 'jajaja dale men relax',
                value: 666
            };
            await curr.save();
            assert.isTrue(await file.exists());
    
            // Await for file destruction
            curr.onExpires = async () => {
                assert.isFalse(await file.exists());
                resolve();
            }
        });
    }).timeout(2050);

    it('Create a new session: "bbbbb" and rewind at 500 ms', () => {
        return new Promise<void>(async resolve => {
            // Create the session value
            const curr = new CurrentSession<Data>('bbbbb', 1500, folder.path);
            const file = new File(`${folder.path}/${curr.hash}.json`);
            const time = Date.now();

            // Save current value
            curr.value = {
                text: 'jajaja dale men relax',
                value: 666
            };
            await curr.save();
            assert.isTrue(await file.exists());

            // Rewind the session
            setTimeout(() => curr.rewind(), 500);
    
            // Await for file destruction
            curr.onExpires = async () => {
                assert.isFalse(await file.exists());
                const duration = Date.now() - time;
                assert.isTrue((duration > 1990) && (duration < 2050));
                resolve();
            }
        });
    }).timeout(2050);

    it('Create a new session: "ccccc" and destroy at 1000 ms', () => {
        return new Promise<void>(async resolve => {
            // Create the session value
            const curr = new CurrentSession<Data>('ccccc', 2000, folder.path);
            const file = new File(`${folder.path}/${curr.hash}.json`);

            // Save current value
            curr.value = {
                text: 'jajaja dale men relax',
                value: 666
            };
            await curr.save();
            assert.isTrue(await file.exists());

            // Destroy the session
            setTimeout(async () => {
                curr.destroy();
                assert.isFalse(await file.exists());
            }, 1000);
    
            // Await for file destruction
            setTimeout(async () => {
                assert.isFalse(await file.exists());
                resolve();
            }, 2000);
        });
    }).timeout(2050);
});