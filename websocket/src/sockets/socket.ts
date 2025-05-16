import { turno, partida, ganador, empate, arrayPartida, marcarCasilla, reiniciarPartida } from "../services/game.ts";

export default function (io) {
    const rooms = {};
    const players = { P1: "", P2: "" };

    io.on("connection", (socket) => {
        // Logica de Salas

        socket.on("create-room", (data) => {
            const roomId = crypto.randomUUID();
            socket.emit("room-created", {
                roomId: roomId,
                nickname: data.nickname,
            });
        });

        socket.on("join-room", (data) => {
            console.log("nombre:", data.nickname);
            console.log("La sala es: ", data.roomId);
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
                players.P1 = data.nickname;

                socket.emit("role-assigned", "P1");
            } else if (!room.P2) {
                room.P2 = socket.id;
                players.P2 = data.nickname;
                socket.emit("role-assigned", "P2");

                console.log(players);

                // Iniciar el juego cuando ambos jugadores están presentes
                console.log("\n\n Veamos el juego: ", room, "\n\n");

                io.to(roomId).emit("game-started", {
                    turno: players.P1,
                    player1: players.P1,
                    player2: players.P2,
                    arrayPartida: arrayPartida,
                });
            } else {
                return;
            }
            // Unir al socket a la sala y actualizar la información de la sala

            rooms[roomId] = room;
            console.log(rooms);
        });

        // Logica de Juego
        socket.on("start-game", (data) => {
            const roomId = socket.data.roomId;
            console.log("EN EL START GAME", players.P1);
            io.to(roomId).emit("game-started", {
                turno: players.P1,
                arrayPartida: arrayPartida,
                player1: players.P1,
                player2: players.P2,
            });
        });

        socket.on("restart-game", () => {
            const roomId = socket.data.roomId;
            reiniciarPartida();
            io.to(roomId).emit("game-restarted", {
                turno: players.P1,
                arrayPartida: arrayPartida,
                partida: partida,
                empate: empate,
            });
        });

        
        socket.on("make-move", (data) => {
            const roomId = socket.data.roomId;
            const p1 = rooms[roomId].P1;
            const p2 = rooms[roomId].P2;
            if (turno === "P1" && socket.id !== p1) return;
            if (turno === "P2" && socket.id !== p2) return;

            marcarCasilla(data.index);

            const jugadorTurno = turno === "P1" ? players.P1 : players.P2;
            io.to(roomId).emit("move-made", { arrayPartida: arrayPartida, turno: turno, jugadorTurno: jugadorTurno });

            if (partida) {
                io.to(roomId).emit("game-won", {
                    ganador: jugadorTurno,
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
