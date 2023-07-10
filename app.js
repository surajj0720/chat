require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 8080;
const path = require('path')
const {
    Server
} = require("socket.io");
const io = new Server(server);
const userRoute = require('./routes/userRoute')
const User = require('./models/userModel')

mongoose.connect('mongodb://127.0.0.1:27017/dynamic-chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});




app.use(express.urlencoded({
    extended: true
}))

app.use(express.json());


app.use('/', userRoute)

var usp = io.of('/user-namespace')

usp.on('connection', async (socket) => {
    console.log('User Connected');

    // console.log(socket.handshake.auth.token)
    const userId = socket.handshake.auth.token;

    await User.findByIdAndUpdate({
        _id: userId
    }, {
        $set: {
            is_online: '1'
        }
    })

    // user broadcast online status
    socket.broadcast.emit('getOnlineUser', {
        user_id: userId
    });

    socket.on('disconnect', async () => {
        console.log('User Disconnected')

        await User.findByIdAndUpdate({
            _id: userId
        }, {
            $set: {
                is_online: '0'
            }
        })

        // user broadcast offline status
        socket.broadcast.emit('getOfflineUser', {
            user_id: userId
        });

    })


    // chatting implementation
    socket.on('newChat', (data) => {
        socket.broadcast.emit('loadNewChat', data);
    })
});



server.listen(port, () => {
    console.log(`Listening on ${port}`);
});