import { Hasher } from '.';
import { assert } from 'chai';

/**
 * Asserts that fn will throw an error *(async/await support)*.
 * @param fn function to test.
 * @param message message to check.
 */
async function asyncThrows(fn: () => any, message?: string) {
    try {
        await fn();
        throw new Error('No errors catched');
    } catch (err) {
        if (message) {
            return assert.strictEqual(
                err.message,
                message,
                    'The launched error\'s message is '
                +   'distinct to the expected message'
            );
        } else {
            return assert.ok(true);
        }
    }
}

describe('Testing "./tool/hasher"', () => {
    const text = 'Hola jajajajaja';

    for (let i = 8; i <= 32; i++) {
        it(`Generate Hash: length = ${i}`, async () => {
            const hasher = new Hasher();
            hasher.hashLength = i;
            hasher.createRndSalt(i);

            const resp01 = await hasher.hash(text);
            const valida = hasher.getValidator();
            assert.isTrue(await valida.validate(resp01, text));
        });
    }
    
    it('Check wrong hash text #01', async () => {
        const hasher = new Hasher();
        const result = await hasher.hash(text);

        // Check false
        const valida = hasher.getValidator();
        await asyncThrows(
            async () => await valida.validate('jajaja', text),
            'The text given is incomplete'
        );
    });

    it('Check wrong hash text #02', async () => {
        const hasher = new Hasher();
        const result = await hasher.hash(text);

        // Check false
        const valida = hasher.getValidator();
        await asyncThrows(
            async () => await valida.validate('1111111111111111111111111111111111111111111110', text),
            'The text given has corrupted or incompatible'
        );
    });

    it('Check wrong hash text #03', async () => {
        const hasher = new Hasher();
        const result = await hasher.hash(text);

        // Edit the result
        let hexStr = result.toHexString();
        hexStr = hexStr.slice(0, hexStr.length - 3);
        hexStr += '666';

        // Check false
        const valida = hasher.getValidator();
        assert.isFalse(await valida.validate(hexStr, text));
    });
});
