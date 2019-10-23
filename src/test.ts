import express from "express"
import { createServer } from "http" 
import SocketIO from "socket.io"

import BodyParser from "body-parser"
import * as path from "path"
import * as Session from "./index"

//Initial implementation
const app = express()
const http = createServer(app)
const io = SocketIO(http)

//Initial configuration
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json({ strict: false }))
app.use(express.static(path.join(__dirname, "..", "static")))

//Session-Crossover implementation on Express
app.use(Session.deploy({
    cookieName: "ayyy",
    path: path.join(__dirname, "..", "session"),
    expires: 5,
    isEncrypted: true
}))

//Listeners
app.get("/new", (req, res) => {
    req.session.new()
    req.session.data = {
        text: "jajaja dale men relax",
        value: 555
    }

    res.redirect("/")
})

app.get("/kill", (req, res) => {
    req.session.kill()

    res.redirect("/")
})


app.get("/", (req, res) => {
    if (req.session.isCreated) {    
        res.send({
            sessionId: req.session.id,
            isCreated: req.session.isCreated,
            value: req.session.data
        })
    } else {
        res.send({
            sessionId: req.session.id,
            isCreated: req.session.isCreated,
            value: null
        })
    }
})
app.listen(80, () => {
    console.clear()
    console.log("Tests Initialization...")
})