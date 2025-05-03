export default function (io) {
    io.on("connection", (socket) => {
        console.log("Nuevo cliente conectado:", socket.id);

        // Logica de Salas

        socket.on("join-room", (roomId) => {
            socket.join(roomId);
            io.to(roomId).emit("room-joined", `${socket.id} se unió a la sala: ${roomId}`);
        });


        // Logica de Juego


        socket.on("make-move", (data) => {
            // lógica y validación
            io.to(data.roomId).emit("move-made", data);
        });

        socket.on("disconnect", () => {
            console.log("Cliente desconectado:", socket.id);
        });
    });
};
