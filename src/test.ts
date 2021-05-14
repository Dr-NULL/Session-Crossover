import express, { json } from 'express';
import { jsonSession } from './lib';

const app = express();
app.use(json());
app.use(jsonSession({
    folder: './data',
    expire: 2
}));

app.get('', (_, res) => {
    console.log('Entering to the endpoint...\n');
    res.json({
        text: 'gegege',
        value: 666
    });
    res.end();
});

app.listen(80, '127.0.0.1', () => {
    console.clear();
    console.log('listening...');
});