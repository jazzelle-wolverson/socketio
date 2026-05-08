const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
app.set('view engine', 'ejs');

server.listen(3000, () => {
    console.log('started on: http://localhost:3000');
});

app.get('/', (req, res) => {
    res.render('index');
})

const io = new Server(server);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('chat message', (data) => {
        console.log('Message Received: ${data}');
        io.emit('chat message', data);
    })
});