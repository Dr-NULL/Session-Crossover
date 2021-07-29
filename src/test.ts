import { sessionCrossover } from '.';
import express, { json } from 'express';

interface Data {
    id: number;
    value: string;
}

let id = 0;
const app = express();

app.use(sessionCrossover({
    path: './data',
    expires: 1000 * 10
}));

app.use(json({
    strict: false
}));

app.get('/create', async (req, res) => {
    const current = req.session.current<Data>();    
    if (!current) {
        await req.session.create();
        await req.session
            .current<Data>()
            .save({
                id: ++id,
                value: new Date().toJSON()
            });

        res.json('Sesión creada');
    } else {
        req.session.rewind();
        res.json('Sesión reiniciada');
    }
});

app.get('/destroy', async (req, res) => {
    const current = req.session.current<Data>();
    if (current) {
        await req.session.delete();
        res.json('Sesión destruida!');
    } else {
        res.json('No hay sesión activa...');
    }
});

app.get('/read', async (req, res) => {
    const current = req.session.current<Data>();
    if (current) {
        const data = await current.load();
        res.json(data);
    } else {
        res.json('Usted no ha iniciado sesión');
    }
});

app.listen(80, '127.0.0.1', () => {
    console.clear();
    console.log('listening...');
});