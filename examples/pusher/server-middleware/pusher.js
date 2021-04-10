const Pusher = require('pusher')
const express = require('express')
const app = express()

app.use(express.json())
app.all('/', (req, res) => {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
  })

  pusher.trigger(req.body.channel || 'channel', req.body.event || 'event', {
    message: req.body.message || 'hello world'
  })

  res.sendStatus(200)
})

module.exports = app
