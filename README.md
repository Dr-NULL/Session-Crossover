# Express JSON Session

A NodeJS package that stores the current session into encrypted TS files for ExpressJS. This package includes their respectives types.d.ts (for Typescript).

## Implementation:
For install this package, use npm: 
```powershell
npm install --save express-json-session
```
Later, for implement with __ExpressJS__ do you call the `*.deploy({ ... })` method into the `app.use( here )` in __ExpressJS__. Here is an example:
```ts
import express from "express"
import * as Session from "session-crossover"

const app = express()
//↓↓↓↓ This is the Session-Crossover Implementation ↓↓↓↓
app.use(Session.deploy({
    path: path.join(__dirname, "..", "session"),
    expires: 5,
    isEncrypted: true
}))
//↑↑↑↑ This is the Session-Crossover Implementation ↑↑↑↑
```

## Configuration

When you typing the `*.deploy({ ... })` method, this will request an object with some configuration parameters, such as:
- `path: string` - Path of the folder will be storage all sessions. If the folder doesn't exists, the own library will create the folder when its necesary.
- `expiration: number` - Amount of minutes than the session will be alive.
- `isEncrypted: boolean` - If you need to encrypt the session ID at the client side.
- `cookieName: string` - The name of the cookie than save the session ID.

## Usage

In the request object (of ExpressJS) will appears an property called `session`. There is an example of usage:
```ts
import express from "express"
import * as Session from "session-crossover"

//Implementation
const app = express()
app.use(Session.deploy({
    path: path.join(__dirname, "..", "session"),
    expires: 5,
    isEncrypted: true
}))

//Usage
app.get("/new", (req, res) => {
    //Creates a new Session
    req.session.new()

    //Adding an object has value
    req.session.data = {
        text: "jajaja dale men relax",
        value: 666
    }

    res.redirect("/")
})

app.get("/", (req, res) => {
    //Show session data
    res.send(req.session.data)
})

//Initializes the server
app.listen(80, () => {
    console.clear()
    console.log("Ready!")
    console.log("Listening...")
})
```
