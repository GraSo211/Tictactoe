import { ReactNode, use, useEffect, useRef, useState } from "react";
import Tablero from "./Tablero";
import Turno from "./Turno";
import { RxCircle } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";

import socket from "../socket.js";
import { ThreeDots } from "react-loading-icons";
import Audio from "react-loading-icons/dist/esm/components/audio";
import BallTriangle from "react-loading-icons/dist/esm/components/ball-triangle";
import Bars from "react-loading-icons/dist/esm/components/bars";
import Circles from "react-loading-icons/dist/esm/components/circles";
import Grid from "react-loading-icons/dist/esm/components/grid";
import Hearts from "react-loading-icons/dist/esm/components/hearts";
import Oval from "react-loading-icons/dist/esm/components/oval";
import Puff from "react-loading-icons/dist/esm/components/puff";
import Rings from "react-loading-icons/dist/esm/components/rings";
import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";

/* 
    todo: 1 - CUANDO INGRESA UNA SALA Y NO EXISTE LO INFORMAMOS Y NO DEBERIAMOS CREARLA, PARA ESO DEBERIA EL CREAR UNA SALA.
    todo: 2 - JUGAR CONTRA LA IA.
    todo: 3 - SALA DE ESPERA, MIENTRAS SE UNE EL OTRO JUGADOR.
    todo: 4 - 
    

*/

export default function Juego() {
    const refNickname = useRef<HTMLInputElement>(null);
    const [nickname, setNickname] = useState<string>("");
    const [msjCopiadoVisible, setMsjCopiadoVisible] = useState<boolean>(false);

    const [ventanaUnirse, setVentanaUnirse] = useState<boolean>(false);
    const [ventanaCrear, setVentanaCrear] = useState<boolean>(false);

    const [player1, setPlayer1] = useState<string>("P1");
    const [player2, setPlayer2] = useState<string>("P2");

    const [turno, setTurno] = useState<string>("P1");

    // Array que se muestra en la UI
    const [arrayRenderized, setarrayRenderized] = useState(Array(9).fill(null));

    // Array que guarda el estado del juego.
    const [array, setArray] = useState(Array(9).fill(null));

    // Boolean para saber si la partida se esta jugando
    const [juegoIniciado, setJuego] = useState<boolean>(false);

    // Boolean para saber si la partida ya finalizo
    const [partida, setPartida] = useState<boolean>(false);

    // Definir el nombre del ganador
    const [ganador, setGanador] = useState<string>("");

    // Definir si hubo empate
    const [empate, setEmpate] = useState<boolean>(false);

    // Definir el id de la sala
    const refRoom = useRef<HTMLInputElement>(null);
    const [roomId, setRoomId] = useState<string>("");

    // Definir el icono de cada jugador
    const circle = <RxCircle className="text-blue-500  xl:size-[80px]" size={50}></RxCircle>;
    const cross = <RxCross2 className="text-red-400 xl:size-[80px]" size={50}></RxCross2>;

    const updtNickname = (name: string) => {
        setNickname(name);
        localStorage.setItem("nickname", name);
    };

    // Salas
    const createRoom = () => {
        socket.emit("create-room", { nickname: nickname });
        setVentanaCrear(true);
    };

    const joinRoom = () => {
        setVentanaUnirse(true);

        /*   */
    };

    // Partida
    const reiniciarPartida = () => {
        socket.emit("restart-game");
    };

    const marcarCasilla = (index: number) => {
        socket.emit("make-move", { index: index });
    };

    useEffect(() => {
        if (localStorage.getItem("nickname") !== null) setNickname(localStorage.getItem("nickname")!);

        socket.on("game-players", (data) => {
            setPlayer1(data.player1);
            setPlayer2(data.player2);
        });

        socket.on("room-created", (data) => {
            setNickname(data.nickname);
            setRoomId(data.roomId);
            socket.emit("join-room", { roomId: data.roomId, nickname: data.nickname });
        });

        socket.on("room-joined", (message) => {
            console.log(message);
        });

        socket.on("game-started", (data) => {
            setJuego(true);
            setTurno(data.turno);
            setArray(data.arrayPartida);
            setarrayRenderized(data.arrayPartida);
            setPlayer1(data.player1);
            setPlayer2(data.player2);
        });

        socket.on("move-made", (data) => {
            setArray(data.arrayPartida);
            setTurno(data.jugadorTurno);
        });

        socket.on("game-won", (data) => {
            setGanador(data.ganador);
            setPartida(data.partida);
        });

        socket.on("game-restarted", (data) => {
            setTurno(data.turno);
            setArray(data.arrayPartida);
            setarrayRenderized(data.arrayPartida);
            setPartida(data.partida);
            setEmpate(data.empate);
        });

        socket.on("game-finished", (data) => {
            setEmpate(data.resultado);
        });

        return () => {
            socket.off("room-joined");
            socket.off("game-started");
            socket.off("move-made");
            socket.off("game-won");
            socket.off("game-restarted");
            socket.off("game-finished");
            socket.off;
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
        <div className="flex flex-col h-full justify-center items-center text-center ">
            <h1 className="text-[#D4C9BE] text-6xl font-semibold my-5  ">TIC-TAC-TOE</h1>

            {nickname ? (
                juegoIniciado ? (
                    <div className=" w-full h-full grid grid-cols-[1fr_2fr_1fr]  place-items-center  ">
                        <Turno signo={circle} jugadorNombre={player1} seleccionado={turno}></Turno>
                        <Tablero tabla={arrayRenderized} marcar={marcarCasilla} array={arrayRenderized}></Tablero>
                        <Turno signo={cross} jugadorNombre={player2} seleccionado={turno}></Turno>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 p-4  justify-center items-center">
                        <h2 className="absolute top-2 left-5 z-0 text-white font-semibold text-2xl">{nickname}</h2>
                        <button
                            className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-120  text-[#D4C9BE] font-semibold"
                            onClick={() => setJuego(true)}
                        >
                            JUGAR CONTRA LA IA
                        </button>
                        <button
                            className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-120 text-[#D4C9BE] font-semibold"
                            onClick={() => createRoom()}
                        >
                            CREAR SALA
                        </button>
                        <button
                            className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-120  text-[#D4C9BE] font-semibold"
                            onClick={() => joinRoom()}
                        >
                            UNIRSE A SALA
                        </button>
                        {ventanaUnirse && (
                            <div className="bg-black/60 z-10 backdrop-blur-sm fixed inset-0 flex justify-center items-center" onClick={() => setVentanaUnirse(false)}>
                                <span
                                    className="bg-white/10 backdrop-blur-md z-30 px-8 py-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center gap-6 border border-white/20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <p className="text-3xl font-bold text-[#D4C9BE]">Ingresa a la Sala</p>

                                    <input
                                        className="bg-slate-800 text-white placeholder-gray-400 rounded-lg w-full py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-inner border border-slate-600"
                                        type="text"
                                        placeholder="Código de sala"
                                        ref={refRoom}
                                        onClick={(e) => e.stopPropagation()}
                                    />

                                    <button
                                        className="bg-[#123458] cursor-pointer text-white text-base font-medium w-full py-3 rounded-xl hover:bg-[#145ea8] transition transform hover:scale-105"
                                        onClick={() => {
                                            if (refRoom.current) {
                                                setRoomId(refRoom.current.value);
                                                socket.emit("join-room", {
                                                    roomId: refRoom.current.value,
                                                    nickname: nickname,
                                                });
                                            }
                                        }}
                                    >
                                        Unirse
                                    </button>
                                </span>
                            </div>
                        )}
                        {ventanaCrear && (
                            <div className="bg-black/60 z-10 backdrop-blur-sm fixed inset-0 flex justify-center items-center" onClick={() => setVentanaCrear(false)}>
                                <span
                                    className="bg-white/10 backdrop-blur-md z-30 px-8 py-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center gap-6 border border-white/20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <p className="text-3xl font-bold text-[#D4C9BE]">Creación de Sala</p>

                                    <span
                                        className="bg-slate-800 text-white text-center font-mono tracking-widest rounded-lg w-full py-3 px-4 text-sm shadow-inner border border-slate-600 select-all"
                                        ref={refRoom}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {roomId || "-------- ---- ---- ---- ------------"}
                                    </span>

                                    <button
                                        className="bg-[#123458] cursor-pointer text-white text-base font-medium w-full py-3 rounded-xl hover:bg-[#145ea8] transition transform hover:scale-105"
                                        onClick={() => {
                                            navigator.clipboard.writeText(roomId);
                                            setMsjCopiadoVisible(true);
                                            setTimeout(() => setMsjCopiadoVisible(false), 1000);
                                        }}
                                    >
                                        Copiar
                                    </button>
                                    {msjCopiadoVisible && <span className="text-green-400 text-sm font-semibold animate-fade-in">¡Copiado!</span>}
                                    <div>
                                        <p className="text-white text-sm text-center">¡Comparte este código con tu amigo!</p>
                                        <div className="flex gap-3 justify-center items-center">
                                            <p className="text-white text-sm text-center ">Esperando Jugadores </p>
                                            <BallTriangle className="w-6" />
                                        </div>
                                        <p className="text-white text-sm text-center ">No abandones esta ventana! </p>
                                    </div>
                                </span>
                            </div>
                        )}
                    </div>
                )
            ) : (
                <span className="flex flex-col    justify-center items-center text-[rgb(20,20,19)]   text-lg  font-semibold  ">
                    <p>Ingresa tu Nickname</p>
                    <span className="flex flex-col gap-1 text-xs justify-center w-full items-center">
                        <input className="bg-slate-700 rounded-sm w-full  p-2" type="text" placeholder="Tu Nickname" ref={refNickname} />
                        <button
                            className="cursor-pointer bg-[#123458] w-full  p-2 rounded-sm hover:animate-none hover:scale-105  "
                            onClick={() => {
                                updtNickname(refNickname.current?.value!);
                            }}
                        >
                            Aceptar
                        </button>
                        <p>{nickname}</p>
                    </span>
                </span>
            )}

            {partida && (
                <div className="absolute top-0 left-0 flex   w-screen h-screen  bg-black/90 ">
                    <div className="relative w-full h-full  text-[#D4C9BE] font-semibold flex flex-col  justify-center items-center ">
                        <span className="border flex flex-col gap-3  p-10 rounded-sm  ">
                            <h1 className="text-2xl  ">GANO {ganador}</h1>
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
