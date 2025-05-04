import {turno, partida, ganador, empate, arrayPartida, marcarCasilla, reiniciarPartida} from "../services/game.ts"

export default function (io) {
    io.on("connection", (socket) => {
        console.log("Nuevo cliente conectado:", socket.id);

        // Logica de Salas

        socket.on("join-room", (roomId) => {
            socket.join(roomId);
            io.to(roomId).emit("room-joined", `${socket.id} se unió a la sala: ${roomId}`);
        });


        // Logica de Juego
        socket.on("start-game", (data) => {
            // lógica y validación
            io.to("1").emit("game-started", data);
            io.to("1").emit("game-data", {
                "turno": turno,
                "partida": partida,
            })
        })


        if(partida && !empate){
            console.log("ganador")
            io.to("1").emit("game-won", {
                "ganador": ganador,
                "partida": partida
            });
        }



        socket.on("make-move", (data) => {
            // lógica y validación
            marcarCasilla(data.index);

            io.to("1").emit("move-made", {"arrayPartida" : arrayPartida});
        });

        socket.on("disconnect", () => {
            console.log("Cliente desconectado:", socket.id);
        });
    });
};
