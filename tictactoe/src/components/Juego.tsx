import { ReactNode, use, useEffect, useState } from "react";
import Tablero from "./Tablero";
import Turno from "./Turno";
import { RxCircle } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";

import socket from "../socket.js";

type Jugadores = "P1" | "P2";

export default function Juego() {
    let [turno, setTurno] = useState<Jugadores>("P1");

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

    const joinRoom = () => {
        socket.emit("join-room", "1");
    };

    const reiniciarPartida = () => {
        socket.emit(
            "restart-game"
            // todo: veremos...
        );
    };

    const marcarCasilla = (index: number) => {
        socket.emit("make-move", { index: index });
    };

    useEffect(() => {
        socket.on("room-joined", (message) => {
            console.log(message);
            setJuego(true);
        });

        socket.on("game-started", (data) => {
            setTurno(data.turno);
            setArray(data.arrayPartida);
            setarrayRenderized(data.arrayPartida);
        });

        socket.on("move-made", (data) => {
            setArray(data.arrayPartida);
        });


        socket.on("game-won", (data) => {
            
            setGanador(data.ganador);
            setPartida(data.partida);
        });


        return () => {
            socket.off("room-joined");
            socket.off("game-started");
            socket.off("move-made");
        };
    }, []);

    useEffect(() => {
        const newArray = array.map((elem) => {
                if (elem === "1") {
                    return circle;
                } else if (elem === "0") {
                    return cross;
                } else {
                    return null;
                }
        });
        setarrayRenderized(newArray);
    }, [array]);

    return (
        <div className="flex flex-col h-full justify-center text-center ">
            <h1 className="text-[#D4C9BE] text-6xl font-semibold my-5  ">TIC-TAC-TOE</h1>

            {juegoIniciado ? (
                <div className=" w-full h-full grid grid-cols-[1fr_2fr_1fr]  place-items-center  ">
                    <Turno signo={circle} jugadorNombre="JUGADOR 1" seleccionado={turno} jugador="P1"></Turno>
                    <Tablero tabla={arrayRenderized} marcar={marcarCasilla} array={arrayRenderized}></Tablero>

                    <Turno signo={cross} jugadorNombre="JUGADOR 2" seleccionado={turno} jugador="P2"></Turno>
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
                        onClick={() => console.log("xd")}
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
