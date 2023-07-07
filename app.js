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



server.listen(port, () => {
    console.log(`Listening on ${port}`);
});