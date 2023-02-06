const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const players = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pages/index.html')
})

io.on('connection', socket => {
  let userId

  socket.on('chat message', msg => {
    io.emit('typing', null)
    io.emit('chat message', msg)
  })

  socket.on('user', user => {
    players.push(user)
    userId = user
    console.log(`${user} connected`)
    io.emit('user', user)
  })

  socket.on('typing', (user) => {
    socket.broadcast.emit('typing', user)
  })

  socket.on('disconnect', () => {
    players.splice(players.indexOf(userId), 1)
    io.emit('user left', userId)
    console.log(`${userId} disconnected`)
  })
})

server.listen(3000, () => {
  console.log('Server listening on port 3000')
})
