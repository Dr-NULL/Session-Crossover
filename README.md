# Session-Crossover

This is a node.js package for manage sessions stored in `*.json` files, and is able to encrypt the data using AES encryption. Also has its corresponding `*.d.ts` files for typescript language.

## Installation

The installation it's a quite simple:
```console
foo@bar:~$ npm install --save session-crossover
```

## Implementation

For configure the session-crossover, import them:
```ts
import * as crossover from 'session-crossover'
```

Later, you must to set the middleware to an express instance:
```ts
import express from 'express';
import * as crossover from '.';
import { resolve } from 'path';

const app = express()
app.use(crossover.deploy({
  path: resolve('data'),                // Path of the data folder.
  expires: 30,                          // Expiration time (in minutes).
  filenameLength: 64,                   // [default = 96] Length of the id generated (give at least 20 characters to generate).
  cookieName: 'session',                // [default = "session"] Name of the cookie.
  aesType: 'aes-192-gcm',               // [optional] AES type encryption (see the subtitle "AES Encryption").
  callback: (data: any) => {            // [optional] A function that will be executed when the session ends.
    console.log('Session was ended.')
  }
}))
```

## Usage

When you make an endpoint, in the request instance, you have access to the `req.session` property. This object contains 3 methods, such as:
```ts
app.get('/', (req, res) => {
  req.session.create()    // create a new session
  req.session.rewind()    // reset the countdown expiration time
  req.session.delete()    // delete the current session
  req.session.current     // it's the current session instance
})
```
When the session does not exists (or was deleted), the `req.session.current` is in undefined state, so you can check if the current session exist or not simply checking the `req.session.current` value, for example:
```ts
app.get('/', (req, res) => {
  if (req.session.current) {
    // At this point, the session exists and you can
    // access to the data of the current session
    
    req.session.current.created         // The date when the session was created
    req.session.current.expires         // The date when the session will be destroy
    req.session.current.getData()       // Return the data of the current session
    req.session.current.setData({       // Set the value of the current session
      id: 123456789,
      name: 'Brian Carroll'
    })
  } else {
    // At this point, the session does not exist. so if
    // you need a session, you can create it in this
    // place
  }
})
```

## AES Encryption

When you don't especify the AES algorithm encryption, the data stored in the specified folder will be saved as a JSON file. So you can open the file and read the data stored in this current session. Also the name of the session is the ID of the current session. If you specify an AES algorithm, the JSON data and the cookies (name and id stored) will be encrypted. The AES KEY and IV are generated using a random byte generator and stored in memory. That's means when you start your server, the session-crossover created a random KEY and IV, and stores these only in memory. The data of the sessions are readable only for your express instance. The AES algorithms available are:
  - `aes-128-ccm`
  - `aes-192-ccm`
  - `aes-256-ccm`
  - `aes-128-gcm`
  - `aes-192-gcm`
  - `aes-256-gcm`

