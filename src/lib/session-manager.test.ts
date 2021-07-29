import { Options, RequestWithCookies, ResponseForCookies } from './interfaces';
import { SessionManager } from './session-manager';
import { CookieManager } from '../tool/cookie-manager';
import { Folder } from '../tool/fsys';
import { Queue } from './queue';

import { CookieOptions } from 'express';
import { assert } from 'chai';

interface Data {
    id: number;
    value: string;
}

class FakeReq implements RequestWithCookies {
    headers = {};
}

class FakeRes implements ResponseForCookies {
    cookie(name: string, val: string, opt?: CookieOptions) { return this; }
    clearCookie(name: string, opt?: CookieOptions) { return this; }
}

function delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

describe('Testing "./lib/session-manager"', () => {
    const folder = new Folder('./test');

    before(async () => {
        await folder.make();
    });

    after(async () => {
        await folder.delete();
    });

    it('Basic session lifecycle', async () => {
        const req = new FakeReq();
        const res = new FakeRes();
        const opt: Options = {
            path: './test',
            name: 'pendeja',
            expires: 1500
        };

        const queue = new Queue(opt);
        const cookieManager = new CookieManager(req, res);
        const sessionManager = new SessionManager(
            cookieManager,
            queue,
            opt
        );

        await sessionManager.create();
        await sessionManager
            .current()
            .save({
                id: 333,
                value: ':wold:'
            });

        let data: Data;
        setTimeout(async () => {
            data = await sessionManager
                .current<Data>()
                .load();
        }, 1000);

        await delay(2050);
        assert.hasAllKeys(data, [ 'id', 'value' ]);
        assert.strictEqual(data?.id, 333);
        assert.strictEqual(data?.value, ':wold:');
        assert.isNull(sessionManager.current());
    }).timeout(2100);

    it('2 Sessions lifecycle', async () => {
        // Server Comp
        const opt: Options = {
            path: './test',
            name: 'pendeja',
            expires: 1500
        };
        const queue = new Queue(opt);

        // Client A
        const reqA = new FakeReq();
        const resA = new FakeRes();
        const cookieManagA = new CookieManager(reqA, resA);
        const sessionManagA = new SessionManager(
            cookieManagA,
            queue,
            opt
        );
        
        // Save data into session A
        setTimeout(async () => {
            await sessionManagA.create();
            await sessionManagA
                .current<Data>()
                .save({
                    id: 999,
                    value: ':wold:'
                });
        }, 0);
        
        // Load data from the session A
        let dataA: Data;
        setTimeout(async () => {
            dataA = await sessionManagA
                .current<Data>()
                .load();

            assert.isNotNull(sessionManagA.current<Data>());
        }, 500);

        // Client B
        const reqB = new FakeReq();
        const resB = new FakeRes();
        const cookieManagB = new CookieManager(reqB, resB);
        const sessionManagB = new SessionManager(
            cookieManagB,
            queue,
            opt
        );
        
        // Save data into session B
        setTimeout(async () => {
            await sessionManagB.create();
            await sessionManagB
                .current<Data>()
                .save({
                    id: 111,
                    value: ':pyra:'
                });
        }, 500);
        
        // Load data from the session B
        let dataB: Data;
        setTimeout(async () => {
            dataB = await sessionManagB
                .current<Data>()
                .load();

            assert.isNotNull(sessionManagB.current<Data>());
        }, 1000);

        await delay(1550);
        assert.isNull(sessionManagA.current<Data>());
        assert.hasAllKeys(dataA, [ 'id', 'value' ]);
        assert.strictEqual(dataA?.id, 999);
        assert.strictEqual(dataA?.value, ':wold:');
        
        await delay(500);
        assert.isNull(sessionManagB.current<Data>());
        assert.hasAllKeys(dataB, [ 'id', 'value' ]);
        assert.strictEqual(dataB?.id, 111);
        assert.strictEqual(dataB?.value, ':pyra:');
    }).timeout(2100);
});
