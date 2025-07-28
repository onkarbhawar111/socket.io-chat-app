import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import mongoose from 'mongoose'
import Message from './models/Message.js'
import { timeStamp } from 'console'

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
})

app.use(cors());

mongoose.connect('mongodb://localhost:27017/socket_io_chat_app')
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log('MongoDb Connection Error: ', err))

app.get('/messages', async (req, res) => {
    const messages = await Message.find().sort({timeStamp: 1});
    res.json(messages);
})

io.on('connection', (socket) => {
    console.log('User Connected: ', socket.id)
    
    socket.on('chatMessage', async ({ username, text }) => {
        const message = new Message({ username, text });
        await message.save();
        
        io.emit('chatMessage', message);
    })
    socket.on('disconnect', (socket) =>{ 
        console.log('User disconnected :', socket.id)
    })
})


server.listen(5000, ()=>{
    console.log('server is running at 5000')
})