import express from 'express';
import * as crossover from '.';
import { resolve } from 'path';

let created: number;

const app = express()
app.use(crossover.deploy({
  path: resolve('data'),
  cookieName: 'gegege',
  expires: (1 / 60) * 10,
  aesType: 'aes-192-gcm',
  filenameLength: 64,
  callback: () => {
    created = Date.now() - created
    created /= 1000

    console.log('killed...')
    console.log(`${created} sec~\n`)
  }
}))

app.get('/', (req, res) => {
  if (req.session.current) {
    // Return the session data
    const data = req
      .session
      .current
      .getData()

    res.send(data)
  } else {
    // Create a new session
    req.session.create()

    // Set data to the session
    req.session.current.setData({
      number: Math.random() * 10000,
      text: 'Random Number'
    })

    created = Date.now()
    console.log('New!!!!')
    res.send('Session created successfully.')
  }
})

app.get('/get', (req, res) => {
  if (req.session.current) {
    res.send(req.session.current.getData())
  } else {
    res.send('No hay sesión creada...')
  }
})

app.get('/set/:data?', (req, res) => {
  if (req.session.current) {
    req.session.current.setData({
      number: Math.random() * 10000,
      text: req.params.data
    })
    res.send(req.session.current.getData())
  } else {
    res.send('No hay sesión creada...')
  }
})

app.get('/delete', (req, res) => {
  if (req.session.current) {
    req.session.delete()
    res.send('Sesión asesinada con éxito!')
  } else {
    res.send('No hay sesión para matar...')
  }
})

app.get('/refresh', (req, res) => {
  if (req.session.current) {
    req.session.rewind()
    res.send('Sesión rebobinada con éxito!')
  } else {
    res.send('No hay sesión para rebobinar...')
  }
})

app.listen(80, () => {
  console.clear()
  console.log('Ready!')
})