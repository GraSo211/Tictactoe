import { ReactNode, useEffect, useState } from "react";
import Tablero from "./Tablero";
import Turno from "./Turno";
import { RxCircle } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";

import socket from "../socket.js";

export default function Juego() {
    // Jugadores: p1 y p2
    type Jugadores = "p1" | "p2";
    // Turno de jugadores
    let [turno, setTurno] = useState<Jugadores>("p1");
    // Array que se muestra en la UI
    let [arrayRenderized, setarrayRenderized] = useState(Array(9).fill(null));

    // Array que guarda el estado del juego.
    let [array, setArray] = useState(Array(9).fill(null));

    // Boolean para saber si la partida se esta jugando
    let [juegoIniciado, setJuego] = useState<boolean>(false);

    // Boolean para saber si la partida ya finalizo
    let [partida, setPartida] = useState<boolean>(false);

    // Definir el nombre del ganador
    let [ganador, setGanador] = useState<string>("");

    // Definir si hubo empate
    let [empate, setEmpate] = useState<boolean>(false);

    // Definir el icono de cada jugador
    const circle = <RxCircle className="text-blue-500  xl:size-[80px]" size={50}></RxCircle>;
    const cross = <RxCross2 className="text-red-400 xl:size-[80px]" size={50}></RxCross2>;

    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    const enviarMensaje = () => {
        
        socket.emit("turno", "acabo de hacer mi jugada!");
    };
    


    const joinRoom = () => {
        socket.emit("join-room", "1");
        socket.on("room-joined", (message) => {
            console.log(message);
        });
    }


    return (
        <div className="flex flex-col h-full justify-center text-center ">
            <h1 className="text-[#D4C9BE] text-6xl font-semibold my-5  ">TIC-TAC-TOE</h1>

            <div className="text-white">
                <h1>Socket.IO en React</h1>
                <button onClick={enviarMensaje} className="bg-red-400 cursor-pointer p-3">
                    Enviar Mensaje
                </button>
            </div>

            {juegoIniciado ? (
                <div className=" w-full h-full grid grid-cols-[1fr_2fr_1fr]  place-items-center  ">
                    <Turno signo={circle} jugadorNombre="JUGADOR 1" seleccionado={turno} jugador="p1"></Turno>
                    <Tablero tabla={arrayRenderized} marcar={marcarCasilla} array={arrayRenderized}></Tablero>

                    <Turno signo={cross} jugadorNombre="JUGADOR 2" seleccionado={turno} jugador="p2"></Turno>
                </div>
            ) : (
                <div className="flex flex-col gap-3 p-4 relative justify-center items-center">
                    <button
                        className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-120  text-[#D4C9BE] font-semibold"
                        onClick={() => setJuego(true)}
                    >
                        JUGAR CONTRA LA IA
                    </button>
                    <button
                        className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-120 text-[#D4C9BE] font-semibold"
                        onClick={() => console.log("xd"
                        )}
                    >
                        CREAR SALA
                    </button>
                    <button
                        className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-120  text-[#D4C9BE] font-semibold"
                        onClick={() => joinRoom()}
                    >
                        UNIRSE A SALA
                    </button>
                </div>
            )}

            {partida && (
                <div className="absolute top-0 left-0 flex   w-screen h-screen  bg-black/90 ">
                    <div className="relative w-full h-full  text-[#D4C9BE] font-semibold flex flex-col  justify-center items-center ">
                        <span className="border flex flex-col gap-3  p-10 rounded-sm  ">
                            <h1 className="text-2xl  ">GANO EL {ganador}</h1>
                            <button className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-125 " onClick={reiniciarPartida}>
                                REINICIAR PARTIDA
                            </button>
                        </span>
                    </div>
                </div>
            )}

            {empate && (
                <div className="absolute top-0 left-0 flex   w-screen h-screen  bg-black/90 ">
                    <div className="relative w-full h-full  text-[#D4C9BE] font-semibold flex flex-col  justify-center items-center ">
                        <span className="border flex flex-col gap-3  p-10 rounded-sm  ">
                            <h1 className="text-2xl  ">EMPATE</h1>
                            <button className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-125 " onClick={reiniciarPartida}>
                                REINICIAR PARTIDA
                            </button>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
