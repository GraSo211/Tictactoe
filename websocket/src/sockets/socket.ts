import { turno, partida, ganador, empate, arrayPartida, marcarCasilla, reiniciarPartida } from "../services/game.ts";

export default function (io) {
    const rooms = {};
    io.on("connection", (socket) => {
        console.log("Nuevo cliente conectado:", socket.id);

        // Logica de Salas
        socket.on("create-room", () => {
            console.log("joining.....")
            const roomId =  crypto.randomUUID();
            socket.join(roomId);
            socket.emit("room-created", roomId);
        });

        socket.on("join-room", (roomId) => {
            socket.join(roomId);
            socket.data.roomId = roomId;
            if (!rooms[roomId]) rooms[roomId] = {};
            if (!rooms[roomId].P1) {
                rooms[roomId].P1 = socket.id;
                socket.emit("role-assigned", "P1");
            } else if (!rooms[roomId].P2) {
                rooms[roomId].P2 = socket.id;
                socket.emit("role-assigned", "P2");

                io.to(roomId).emit("game-started", {
                    turno: "P1",
                    jugadores: rooms[roomId],
                });
            }
        });

        // Logica de Juego
        socket.on("start-game", (data) => {
            const roomId = socket.data.roomId;

            io.to(roomId).emit("game-started", {
                turno: turno,
                arrayPartida: arrayPartida,
            });
        });

        socket.on("restart-game", () => {
            const roomId = socket.data.roomId;
            reiniciarPartida();
            io.to(roomId).emit("game-restarted", {
                turno: turno,
                arrayPartida: arrayPartida,
                partida: partida,
                empate: empate,
            });
        });

        socket.on("make-move", (data) => {
            const roomId = socket.data.roomId;
            marcarCasilla(data.index);

            io.to(roomId).emit("move-made", { arrayPartida: arrayPartida, turno: turno });
            if (partida) {
                io.to(roomId).emit("game-won", {
                    ganador: ganador,
                    partida: partida,
                });
            }
            if (empate) {
                io.to(roomId).emit("game-finished", {
                    resultado: empate,
                });
            }
        });

        socket.on("disconnect", () => {
            const roomId = socket.data.roomId;
            console.log("Cliente desconectado:", socket.id);
            reiniciarPartida();
            io.to(roomId).emit("game-restarted", {
                turno: turno,
                arrayPartida: arrayPartida,
                partida: partida,
                empate: empate,
            });
        });
    });
}
