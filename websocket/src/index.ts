import express,{ Request, Response } from 'express';

import { Server } from 'socket.io';
import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const app = express();

const server = createServer(app);
const io = new Server(server);


io.on("connection", (socket) => {
    console.log("Usuario conectado")
});

app.get("/",(req: Request , res: Response)=>{
    res.send("Hello World!!!")
})



server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

