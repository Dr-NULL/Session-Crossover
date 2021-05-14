import { CurrentSession } from './current-session';
import { File, Folder } from '../tool/fsys';
import { assert } from 'chai';
import { SessionNotFound } from './errors';

describe('Testing "./lib/current-session"', () => {
    before(async () => {
        const folder = new Folder('./data-test');
        await folder.make();
        
        const file = new File('./data-test/test.json');
        const text = JSON.stringify({ });
        const byte = Buffer.from(text, 'utf-8');
        await file.write(byte);
    });

    after(async () => {
        const folder = new Folder('./data-test');
        await folder.delete();
    });

    it('Create the current session', async () => {
        const current = new CurrentSession(new Date(), './data-test/test.json');
        await current.save({
            id: 666,
            name: 'Blame Hofmann',
            birth: new Date(1994, 4, 6)
        });
    });

    it('Load the current session', async () => {
        const current = new CurrentSession(new Date(), './data-test/test.json');
        const data = await current.load();

        assert.hasAllKeys(data, [ 'id', 'name', 'birth' ]);
        assert.strictEqual(data.id, 666);
        assert.strictEqual(data.name, 'Blame Hofmann');
        assert.strictEqual(data.birth?.toISOString(), new Date(1994, 4, 6).toISOString());
    });

    it('Load a non existing session', async () => {
        const file = new File('./data-test/test.json');
        await file.delete();

        try {
            const current = new CurrentSession(new Date(), './data-test/test.json');
            await current.load();
        } catch (err) {
            assert.strictEqual(err.code, SessionNotFound.code);
        }
    });
});
