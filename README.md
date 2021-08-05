# Suspicious Session

This is a package to manage sessions stored in __encrypted__ files using __UUIDv4__ for client identification for [Express.js](https://expressjs.com/). This package it's a newer version writted from zero based of [session-crossover](https://www.npmjs.com/package/session-crossover) package _(now deprecated)._ This package is developed with [typescript](https://www.typescriptlang.org/) and contains all required `*.d.ts` definitions inside it.


## Implementation

- First install this package in your project:
```console
foo@bar:~$ npm install --save suspicious-session
```

- Then create a new `express();` instance, and use the middleware as follows:
```ts
import express from 'express';
import { suspiciousSession } from 'suspicious-session';

// Create the express instance
const app = express();

// Use the middleware
app.use(suspiciousSession({
    path: './data',             // Where the sessions will be stored
    name: 'i-see-you',          // [ default = 'session-id' ] Name of the cookie to create
    maxAge: 15000,              // [ default = 30000 ] Time of session duration (in ms)
    algorithm: 'aes-256-ccm',   // [ default = 'aes-128-ccm' ] AES algorithm do you want to use
}));
```


## Basic Usage

The core of the package resides in `req.session`, which contains the necessary methods to manage the current sessions. All operations about sessions are available in that object. These are some examples of usage:

- Create a new session, and save inside an object:
```ts
app.get('/create', async (req, res) => {
    // Create a new session
    await req.session.create();

    // Add inside an object
    await req.session.current().save({
        id: 666,
        nick: 'nadja',
        typeUser: 4
    });

    // Ends the request
    res.end();
});
```

- Rewind the expiration time of the current session:
```ts
app.get('/rewind', async (req, res) => {
    // Get if this connection has an active sesion
    const exist = !!req.session.current();

    // Rewind the expiration time
    if (exist) {
        req.session.rewind();
    }

    // Ends the request
    res.end();
});
```

- Destroy the current session:
```ts
app.get('/destroy', async (req, res) => {
    // Get if this connection has an active sesion
    const exist = !!req.session.current();

    // Destroy the current session
    if (exist) {
        await req.session.destroy();
    }

    // Ends the request
    res.end();
});
```

- Read data from a session:
```ts
app.get('/read', async (req, res) => {
    // Get the current active session
    const current = req.session.current();

    if (current) {
        // Read the session content
        const data = await current.load();
        res.json(data);
    } else {
        // Return null
        res.json(null);
    }
});
```

## How it works?

This library stores the session data inside of `*.sus` files. These files are writting using AES encryption. Every session it's identified with a unique __UUIDv4__, the files created uses those UUID as filename, but the cookie created in the client has the UUID encripted. For more details about de whole mechanism:

### AES Encription:

The encryption it's made using a class called `AESCrypto`. When the middleware is executed, the app creates inside an instance of `AESCrypto`. This instance generates a random key _(the byte length depends of the algorithm used)._ When a new session is created, the `AESCrypto` instance generates a new random __iv__, only for this new session. While the __express instance__ is working, the `AESCrypto` instante use the same key created at the begining for all encription process, but every __encrypt__ request generates a new random __iv__ for every individual call.


### The "current session":

Every session are an instance of `CurrentSession`. That class has the necesary properties and methods for manage a single session. When a session is created, an unique __UUIDv4__ is asigned to the instance