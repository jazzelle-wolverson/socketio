const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
app.set('view engine', 'ejs');
app.use(express.static('public'));

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
        console.log(`Message Received: ${data}`);
        io.emit('chat message', {username: socket.username, message: data, textColor: socket.textColor});
    });

    socket.on("setColor", (data) => {
        console.log(data);
        socket.textColor = data;
    });

    socket.on("username", (data) => {
        socket.username = data;
    });
    
    socket.on("createRoom", (data) => {
        socket.currentRoom = data;
        socket.join(data);
        io.to(data).emit("roomCreated", {username: socket.username, room: data});
    });

    socket.on("messageRoom", (data) => {
        io.to(socket.currentRoom).emit("roomMessaged", {username: socket.username, message: data});
    });

    socket.on("joinRoom", (data) => {
        socket.currentRoom = data;
        socket.join(data);
        io.to(data).emit("userJoined", {username: socket.username, room: data});
    });


});