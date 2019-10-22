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
    path: path.join(__dirname, "..", "session"),
    expires: 1
}))

//Listeners
app.get("/", (req, res) => {
    console.log("this is an Endpoint...\n")
    res.send({ text: "non" })
})
app.listen(80, () => {
    console.clear()
    console.log("Tests Initialization...")
})