import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

const server = createServer(app);
const io = new Server(server);


io.on("connection", (socket) => {
    console.log("Usuario conectado")

    // Envio de mensaje al cliente
    socket.on("turno", (msg) => {
        console.log("Mensaje recibido: " + msg);
        io.emit("turno", "Mensaje devuelto por el servidor");
        
    })


    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });
});





server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

