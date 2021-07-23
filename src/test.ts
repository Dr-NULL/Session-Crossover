import express, { json } from 'express';
import { CookieManager } from './tool/cookie-manager';
import { sessionCrossover } from './lib';

const app = express();
app.use(sessionCrossover({
    folder: './data',
    expire: 2
}));

app.get('/read', (req, res) => {
    // const manager = new CookieManager(req, res);
    // const data = manager
    //     .getAll()
    //     .map(x => ({
    //         name: x.name,
    //         value: x.value
    //     }));

    // res.send(data);
    res.end(req.headers.cookie);
});

app.get('/write', (req, res) => {
    const maxAge = 1000 * 10;
    res.cookie('cook; ie-a', 666, {
        path: '/',
        secure: true,
        maxAge
    });

    res.cookie('cookie-b', 'jajaja;jejeje', {
        path: '/',
        secure: true,
        maxAge
    });

    res.cookie('cookie-c', 'jajaja=jejeje', {
        path: '/',
        secure: true,
        maxAge
    });

    res.cookie('cookie-d', '     lol     ', {
        path: '/',
        secure: true,
        maxAge
    });

    res.cookie('cookie e', 'invalid!!!', {
        path: '/',
        secure: true,
        maxAge
    });

    res.cookie('cookie=f', 'joder=nya', {
        path: '/',
        secure: true,
        maxAge
    });

    res.cookie('cookie_g', null, {
        path: '/',
        secure: true,
        maxAge
    });

    res.contentType('text');
    res.end('write done!', 'utf8');
});

app.get('/delete', (req, res) => {
    res.clearCookie('cookie-a');
    res.clearCookie('cookie-b');

    res.end('Deleting done!', 'utf8');
});

app.listen(80, '127.0.0.1', () => {
    console.clear();
    console.log('listening...');
});