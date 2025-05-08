import { turno, partida, ganador, empate, arrayPartida, marcarCasilla, reiniciarPartida } from "../services/game.ts";

export default function (io) {
    const rooms = {};

    io.on("connection", (socket) => {
        // Logica de Salas
        
        socket.on("create-room", () => {
            const roomId = crypto.randomUUID();
            socket.emit("room-created", roomId);
        });

        socket.on("join-room", (data) => {
            const roomId = data.roomId;
            const room = rooms[roomId] || {};

            // Verificar si el socket ya está en la sala
            if (room.P1 === socket.id || room.P2 === socket.id) {
                return;
            }

            socket.join(roomId);
            socket.data.roomId = roomId;
            // Asignar roles
            if (!room.P1) {
                room.P1 = socket.id;
                socket.emit("role-assigned", "P1");
            } else if (!room.P2) {
                room.P2 = socket.id;
                socket.emit("role-assigned", "P2");

                // Iniciar el juego cuando ambos jugadores están presentes
                console.log("\n\n Veamos el juego: ", room, "\n\n");
                io.to(roomId).emit("game-started", {
                    turno: room.P1,
                    jugadores: room,
                    arrayPartida: arrayPartida,
                });

                socket.emit("game-players", {
                    player1: rooms[roomId].P1,
                    player2: rooms[roomId].P2,
                });
            } else {
                return;
            }

            // Unir al socket a la sala y actualizar la información de la sala

            rooms[roomId] = room;
            console.log(rooms);
        });

        // Logica de Jugadores

        socket.on("set-nickname", (nickname) => {
            const roomId = socket.data.roomId;
            if (rooms[roomId]) {
                if (rooms[roomId].P1 === socket.id) {
                    rooms[roomId].P1 = nickname;
                } else if (rooms[roomId].P2 === socket.id) {
                    rooms[roomId].P2 = nickname;
                }
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
            const p1 = rooms[roomId].P1;
            const p2 = rooms[roomId].P2;
            if (turno === "P1" && p1 != socket.id) return;
            if (turno === "P2" && p2 != socket.id) return;

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
