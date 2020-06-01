"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crossover = __importStar(require("."));
const path_1 = require("path");
const app = express_1.default();
app.use(crossover.deploy({
    path: path_1.resolve('data'),
    cookieName: 'gegege',
    expires: 1,
    aesType: 'aes-192-gcm',
    filenameLength: 64,
    callback: () => {
        console.log('die!');
    }
}));
app.get('/', (req, res) => {
    if (req.session.current) {
        // Return the session data
        const data = req
            .session
            .current
            .getData();
        res.send(data);
    }
    else {
        // Create a new session
        req.session.create();
        // Set data to the session
        req.session.current.setData({
            number: Math.random() * 10000,
            text: 'Random Number'
        });
        res.send('Session created successfully.');
    }
});
app.get('/get', (req, res) => {
    if (req.session.current) {
        res.send(req.session.current.getData());
    }
    else {
        res.send('No hay sesión creada...');
    }
});
app.get('/set/:data?', (req, res) => {
    if (req.session.current) {
        req.session.current.setData({
            number: Math.random() * 10000,
            text: req.params.data
        });
        res.send(req.session.current.getData());
    }
    else {
        res.send('No hay sesión creada...');
    }
});
app.get('/delete', (req, res) => {
    if (req.session.current) {
        req.session.delete();
        res.send('Sesión asesinada con éxito!');
    }
    else {
        res.send('No hay sesión para matar...');
    }
});
app.listen(80, () => {
    console.clear();
    console.log('Ready!');
});
//# sourceMappingURL=test.js.map