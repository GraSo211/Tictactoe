import { Game, Player } from "../services/game.js";
import { Rooms } from "./socket.js";

export default function roomManager(io, socket, rooms: Rooms) {
    socket.on("remove-room", (roomId) => {
        socket.leave(roomId);
        rooms.delete(roomId);
    });

    socket.on("rejoin-room", (data) => {
        const roomId = data.roomId;
        const userId = data.userId;
        const room = rooms.get(roomId);
        //console.log(room)
        
        if (room && (room.players.P1.id === userId || room.players.P2.id === userId)) {
            socket.join(data.roomId);
            let jugadorTurno = "";
            if(room.game.getTurn() === "P1") {
                jugadorTurno = room.players.P1.name;
            }else{
                jugadorTurno = room.players.P2.name;
            }
            socket.emit("game-state", {
                arrayPartida: room.game.getBoard(),
                jugadorTurno: jugadorTurno,
            });
        }
    });

    socket.on("leave-room", (data) => {
        const roomId = data.roomId;
        const userId = data.userId;

        const room = rooms.get(roomId);

        if (!room) return;

        const { P1, P2 } = room.players;

        if (P1 && P1.id === userId) {
            delete room.players.P1;
        }

        if (P2 && P2.id === userId) {
            delete room.players.P2;
        }

        socket.leave(roomId);
        io.to(roomId).emit("room-left");
    });

    socket.on("create-room", (data) => {
        const roomId = crypto.randomUUID();
        rooms.set(roomId, {
            game: null,
            players: {
                P1: { id: null, name: null },
                P2: { id: null, name: null },
            },
        });

        socket.emit("room-created", {
            roomId: roomId,
            nickname: data.nickname,
            userId: data.userId,
        });
    });

    socket.on("join-room", (data) => {
        const roomId = data.roomId;
        const room = rooms.get(roomId);

        if (room === undefined) {
            socket.emit("room-not-found", {
                state: true,
                msg: "No se encontro la sala.",
            });
            return;
        }

        // Verificar si el socket ya está en la sala

        if (room.players.P1 !== null && room.players.P2 !== null) {
            if (room.players.P1.id === data.userId || room.players.P2.id === data.userId) {
                return;
            }
        }

        socket.join(roomId);
        socket.data.roomId = roomId;

        // Asignar roles
        if (!room.players.P1 || !room.players.P1.id) {
            room.players.P1.id = data.userId;
            room.players.P1.name = data.nickname;
        } else if (!room.players.P2 || !room.players.P2.id) {
            room.players.P2.id = data.userId;
            room.players.P2.name = data.nickname;
        } else {
            return;
        }

        if (room.players.P1.id && room.players.P2.id) {
            // Iniciar el juego cuando ambos jugadores están presentes
            const GAME = new Game(Player.P1);
            room.game = GAME;
            io.to(roomId).emit("start-game", {
                turno: room.players.P1.name,
                player1: room.players.P1.name,
                player2: room.players.P2.name,
                arrayPartida: GAME.getBoard(),
            });
        }

        //console.log(rooms);
    });
}
