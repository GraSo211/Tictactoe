import { Game, Player } from "../services/game.js";
import { Rooms } from "./socket.js";

export default function gameHandler(io, socket, rooms: Rooms) {
    // Logica de Juego

    socket.on("make-move", (data) => {
        const roomId = socket.data.roomId;
        const room = rooms.get(roomId);

        if (!room) return;

        const p1 = room.players.P1;
        const p2 = room.players.P2;
        const game = room.game;

        // el jugador 2 no es la ia O NO es su turno
        if (game.getTurn() === "P1" && data.userId !== p1.id) return;
        if (game.getTurn() === "P2" && data.userId !== p2.id) return;
        game.makeMove(data.index);
        const jugadorTurno = game.getTurn() === "P1" ? p1.name : p2.name;
        io.to(roomId).emit("move-made", { arrayPartida: game.getBoard(), turno: game.getTurn(), jugadorTurno: jugadorTurno });

        if (game.getWinner()) {
            let winner;
            if (game.getWinner() == "P1") {
                winner = rooms.get(roomId).players.P1.name;
                
            } else {
                winner = rooms.get(roomId).players.P2.name;
            }
            io.to(roomId).emit("game-won", {
                ganador: winner,
                winnerId: game.getWinner(),
                partida: game.getGameStatus(),
            });
        }

        if (game.getDraw()) {
            io.to(roomId).emit("game-finished", {
                resultado: game.getDraw(),
            });
        }

        if (p2.id === "IA" && game.getTurn() === "P2" && !game.getWinner() && !game.getDraw()) {
            setTimeout(() => {
                game.makeMoveIA();
                io.to(roomId).emit("move-made-by-ia", {
                    arrayPartida: game.getBoard(),
                    turno: game.getTurn(),
                    jugadorTurno: p1.name,
                });

                // Emitir si gana o empate
                if (game.getWinner()) {
                    const winner = game.getWinner() === "P1" ? p1.name : "IA";
                    io.to(roomId).emit("game-won", {
                        ganador: winner,
                        winnerId: game.getWinner(),
                        partida: game.getGameStatus(),
                    });
                }

                if (game.getDraw()) {
                    io.to(roomId).emit("game-finished", {
                        resultado: true,
                    });
                }
            }, Math.random() * 1000 + 500);
            return;
        }
    });

    socket.on("restart-game", () => {
        const roomId = socket.data.roomId;
        let newTurn;
        let player;
        if (rooms.get(roomId).game.getFirstTurn() === Player.P1) {
            newTurn = Player.P2;
            player = rooms.get(roomId).players.P2.name;
        } else {
            newTurn = Player.P1;
            player = rooms.get(roomId).players.P1.name;
        }

        const newGame = new Game(newTurn);
        rooms.get(roomId).game = newGame;
        io.to(roomId).emit("game-restarted", {
            turno: player,
            arrayPartida: newGame.getBoard(),
            partida: false,
            empate: newGame.getDraw(),
        });
    });

    socket.on("restart-request", () => {
        const roomId = socket.data.roomId;
        const room = rooms.get(roomId);

        // Si el oponente es la IA
        if (room.players.P2.id === "IA") {
            // Decidimos quién arranca
            let newTurn: Player;
            let startingPlayerName: string;

            if (room.game.getFirstTurn() === Player.P1) {
                newTurn = Player.P2;
                startingPlayerName = room.players.P2.name; // “IA”
            } else {
                newTurn = Player.P1;
                startingPlayerName = room.players.P1.name;
            }

            // Creamos el nuevo juego
            const newGame = new Game(newTurn);

            // **Si arranca la IA, que haga su jugada**
            if (newTurn === Player.P2) {
                newGame.makeMoveIA();
                // Ajustamos startingPlayerName al siguiente turno real
                const nextTurn = newGame.getTurn();
                startingPlayerName = nextTurn === Player.P1 ? room.players.P1.name : room.players.P2.name;
            }

            // Guardamos y emitimos estado
            rooms.get(roomId).game = newGame;
            io.to(roomId).emit("game-restarted", {
                turno: startingPlayerName,
                arrayPartida: newGame.getBoard(),
                partida: false,
                empate: false,
            });
            return;
        }
 
        let player;

        if (socket.data.userId === rooms.get(socket.data.roomId).players.P1.id) {
            player = rooms.get(socket.data.roomId).players.P1.name;
        }
        if (socket.data.userId === rooms.get(socket.data.roomId).players.P2.id) {
            player = rooms.get(socket.data.roomId).players.P2.name;
        }

        socket.to(socket.data.roomId).emit("player-request-to-restart", {
            playerRequest: player,
        });
    });
}
