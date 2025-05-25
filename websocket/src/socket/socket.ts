import { Game } from "../services/game.js";
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
const rooms: Rooms = new Map();
export default function (io) {
    

    io.on("connection", (socket) => {

        roomManager(io, socket, rooms);
        gameHandler(io, socket, rooms);

        
    });
}
