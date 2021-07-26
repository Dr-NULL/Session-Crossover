import { assert } from 'chai';
import { CookieOptions } from 'express';
import { CookieElement } from './cookie-element';
import { RequestWithCookies, ResponseForCookies } from './interfaces';

/**
 * Fake class for request simulations
 */
 class FakeRequ implements RequestWithCookies {
    private _headers: { cookie?: string; };
    public get headers(): { cookie?: string; } {
        return this._headers;
    }

    constructor(data: { name: string; value?: string }[]) {
        let cookie = '';
        data.forEach((x, i) => {
            const name = x.name.replace(/;.*$/gi, '');
            if (x.name !== name) {
                delete x.value;
            }

            cookie += `${i ? '; ' : ''}${name}`;
            if (Object.keys(x).some(x => x === 'value')) {
                cookie += '=' + encodeURIComponent(x.value);
            }
        });

        this._headers = { cookie };
    }
}

/**
 * Fake class for response simulations
 */
class FakeResp implements ResponseForCookies {
    cookie(name: string, val: string, options: CookieOptions): FakeResp {
        return this;
    }

    clearCookie(name: string, options: CookieOptions): ResponseForCookies {
        return this;
    }
}

describe('Testing "./tool/cookie-manager/cookie-element"', () => {
    const res = new FakeResp();
    const req = new FakeRequ([
        { name: 'cookie-a', value: 'hola mundo' },
        { name: 'cookie-b', value: `j:${JSON.stringify({ text: "joder", value: 555 })}` },
    ]);

    it('Get "cookie-a" value: "hola mundo"', () => {
        const obj = new CookieElement<string>(req, res, 'cookie-a');
        assert.strictEqual(obj.name, 'cookie-a');
        assert.strictEqual(obj.value, 'hola mundo');
    });

    it('Get "cookie-b" value: { text: "joder", value: 555 }', () => {
        const obj = new CookieElement<{ text: string, value: number; }>(req, res, 'cookie-b');
        assert.strictEqual(obj.name, 'cookie-b');
        assert.hasAllKeys(obj.value ?? { }, [ 'text', 'value' ]);
        assert.strictEqual(obj.value?.text, 'joder');
        assert.strictEqual(obj.value?.value, 555);
    });

    it('Set "cookie-a" value', () => {
        const obj = new CookieElement(req, res, 'cookie-a');
        obj.value = {
            id: 666,
            cod: 'RTX3090TI',
            descript: 'GPU w/ ray tracing'
        };
    });

    it('Set "cookie-c" value (not exists)', () => {
        const obj = new CookieElement(req, res, 'cookie-c');
        obj.value = 'ajajajaja';
        assert.match(req.headers.cookie, /cookie-c=ajajajaja$/gi);
    });

    it('Set "cookie-d" value (not exists)', () => {
        const obj = new CookieElement(req, res, 'cookie-d');
        obj.value = {
            text: 'joder',
            value: 666
        };

        const raw = 'cookie-d=j%3A%7B%22text%22%3A%22joder%22%2C%22value%22%3A666%7D';
        assert.isTrue(req.headers.cookie.endsWith(raw));
    });
});