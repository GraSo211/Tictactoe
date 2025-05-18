import { Game } from "../services/Game.js";
import gameHandler from "./gameHandler.js";
import roomManager from "./roomManager.js";

type Player = {
    id: string,
    name: string
}

export type Room = {
    game: Game;
    players: {
        P1: Player;
        P2: Player;
    };
};

export type Rooms = Map<string, Room>;

export default function (io) {
    const rooms: Rooms = new Map();

    io.on("connection", (socket) => {
        roomManager(io, socket, rooms);
        gameHandler(io, socket, rooms);

        socket.on("disconnect", () => {
            const roomId = socket.data.roomId;
        });
    });
}
