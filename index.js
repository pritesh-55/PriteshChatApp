const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const port = process.env.PORT || 8000

const path = require('path')
app.use(express.static(path.join(__dirname+"/frontend")))

const { Server } = require("socket.io");
const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log('a user connected ',socket.id);

    socket.on('newUser',(username)=>{
        socket.broadcast.emit('update',username+' has joined the chat')
    })

    socket.on('exitUser',(username)=>{
        socket.broadcast.emit('update',username+' has left the chat')
    })

    socket.on('chat',(message)=>{
        socket.broadcast.emit('chat',message)
    })
});

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

httpServer.listen(port, () => {
    console.log('Server is listening to Port no '+port);
});