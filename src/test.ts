import express from 'express';
import * as crossover from '.';
import { resolve } from 'path';

const app = express()
app.use(crossover.deploy({
  path: resolve('data'),
  cookieName: 'gegege',
  expires: 1,
  aesType: 'aes-192-gcm',
  filenameLength: 64,
  callback: () => {
    console.log('die!')
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

app.listen(80, () => {
  console.clear()
  console.log('Ready!')
})