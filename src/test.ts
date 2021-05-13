import express, { json } from 'express';
import { deploy } from './lib/deploy';

const app = express();
app.use(deploy({
    folder: './data'
}));
app.use(json());

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

    setTimeout(() => process.emit('SIGINT', 'SIGINT'), 2500);
});