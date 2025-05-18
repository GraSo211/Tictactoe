import { Game, Player } from "../services/Game.js";
import { Rooms } from "./socket.js";

export default function gameHandler(io, socket, rooms: Rooms) {
    // Logica de Juego
    /*     socket.on("start-game", (data) => {
        const roomId = socket.data.roomId;
        console.log("EN EL START GAME", players.P1);
        io.to(roomId).emit("game-started", {
            turno: players.P1,
            arrayPartida: arrayPartida,
            player1: players.P1,
            player2: players.P2,
        });
    }); */

    socket.on("restart-game", () => {
        const roomId = socket.data.roomId;
        let newTurn;
        let player;
        if (rooms.get(roomId).game.getFirstTurn() === Player.P1) {
            newTurn = Player.P2;
            player = rooms.get(roomId).players.P2.name
        } else {
            newTurn = Player.P1;
            player = rooms.get(roomId).players.P1.name
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

    socket.on("make-move", (data) => {
        const roomId = socket.data.roomId;
        const p1 = rooms.get(roomId).players.P1;
        const p2 = rooms.get(roomId).players.P2;
        const game = rooms.get(roomId).game;
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
                partida: game.getGameStatus(),
            });
        }

        if (game.getDraw()) {
            io.to(roomId).emit("game-finished", {
                resultado: game.getDraw(),
            });
        }

        /*      io.to(roomId).emit("game-restarted", {
            turno: turno,
            arrayPartida: arrayPartida,
            partida: partida,
            empate: empate,
        }); */
    });
}
