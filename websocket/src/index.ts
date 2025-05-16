import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import socket from './sockets/socket.js';

const port = process.env.PORT || 3000;

const app = express();



const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin: "*",
        methods: ["GET", "POST"],
    }
});

app.use(cors());

socket(io);


server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

