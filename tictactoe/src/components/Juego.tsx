import { ReactNode, use, useEffect, useRef, useState } from "react";
import Tablero from "./Tablero";
import Turno from "./Turno";
import { RxCircle } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { v4 as uuid } from "uuid";
import socket from "../socket.js";
import BallTriangle from "react-loading-icons/dist/esm/components/ball-triangle";

/* 
    todo: 2 - JUGAR CONTRA LA IA.
*/

export default function Juego() {
    const refNickname = useRef<HTMLInputElement>(null);
    const [nickname, setNickname] = useState<string>("");
    const [msjCopiadoVisible, setMsjCopiadoVisible] = useState<boolean>(false);

    const [ventanaUnirse, setVentanaUnirse] = useState<boolean>(false);
    const [ventanaCrear, setVentanaCrear] = useState<boolean>(false);

    const [playerRequestRestart, setPlayerRequestRestart] = useState<string>("");

    const [numberWinsP1, setNumberWinsP1] = useState<number>(0);
    const [numberWinsP2, setNumberWinsP2] = useState<number>(0);

    const [restartRequested, setRestartRequested] = useState<boolean>(false);
    const [requestRestart, setRequestRestart] = useState<boolean>(false);

    const [player1, setPlayer1] = useState<string>("P1");
    const [player2, setPlayer2] = useState<string>("P2");

    const [userId, setUserId] = useState<string>("");

    const [roomNotFound, setRoomNotFound] = useState<boolean>(false);

    const [playerLeft, setPlayerLeft] = useState<boolean>(false);

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

    const updtNickname = (name: string) => {
        setNickname(name);
        localStorage.setItem("nickname", name);
    };

    const leaveRoom = () => {
        socket.emit("leave-room", { roomId: roomId, userId: userId });
        cleanupAfterLeave();
    };

    const gameVSIA = async () => {
        socket.emit("create-room-vs-ia", { nickname: nickname, userId: userId });
        setNumberWinsP1(0);
        setNumberWinsP2(0);
        localStorage.setItem("numberWinsP2", "0");
        localStorage.setItem("numberWinsP1", "0");

        await new Promise<void>((resolve) => {
            const handler = (data: any) => {
                socket.off("game-created");
                setRoomId(data.roomId);
                setNickname(data.nickname);
                setUserId(data.userId);
                setTurno(data.turno);
                setPlayer1(data.player1);
                setPlayer2(data.player2);
                setArray(data.arrayPartida);
                setarrayRenderized(data.arrayPartida);
                setJuego(true);
                resolve();
            };
            socket.on("room-vs-ia-created", handler);
        });
    };

    const cleanupAfterLeave = () => {
        setJuego(false);
        setVentanaCrear(false);
        setVentanaUnirse(false);
        setRoomId("");
        setRequestRestart(false);
        setRestartRequested(false);
        setPlayerRequestRestart("");
        setPartida(false);
        setEmpate(false);
        localStorage.removeItem("roomId");
    };

    const leaveCreateRoom = () => {
        setVentanaCrear(false);
        socket.emit("remove-room", roomId);
        localStorage.removeItem("roomId");
    };

    // Salas
    const createRoom = () => {
        socket.emit("create-room", { nickname: nickname, userId: userId });
        setNumberWinsP1(0);
        setNumberWinsP2(0);
        localStorage.setItem("numberWinsP2", "0");
        localStorage.setItem("numberWinsP1", "0");
        setVentanaCrear(true);
    };

    const joinRoom = () => {
        setNumberWinsP1(0);
        setNumberWinsP2(0);
        localStorage.setItem("numberWinsP2", "0");
        localStorage.setItem("numberWinsP1", "0");
        setVentanaUnirse(true);
    };

    // Partida

    const restartGame = () => {
        socket.emit("restart-game");
    };

    const requestRestartGame = () => {
        setRestartRequested(true);
        socket.emit("restart-request");
    };

    const marcarCasilla = (index: number) => {
        socket.emit("make-move", { index: index, userId: userId });
    };

    useEffect(() => {
        const storedRoomId = localStorage.getItem("roomId");
        const storedUserId = localStorage.getItem("userId");
        const storedWinsP1 = localStorage.getItem("numberWinsP1");
        const storedWinsP2 = localStorage.getItem("numberWinsP2");
        if (storedWinsP1 !== null) setNumberWinsP1(parseInt(storedWinsP1));
        if (storedWinsP2 !== null) setNumberWinsP2(parseInt(storedWinsP2));
        if (localStorage.getItem("nickname") !== null) setNickname(localStorage.getItem("nickname")!);
        if (storedRoomId !== null) setRoomId(storedRoomId);

        if (storedUserId !== null) {
            setUserId(storedUserId!);
        } else {
            const id = uuid();
            localStorage.setItem("userId", id);
            setUserId(id);
        }

        socket.on("room-left", () => {
            setPlayerLeft(true);
        });

        if (storedRoomId && storedUserId) {
            socket.emit("rejoin-room", { roomId: storedRoomId, userId: storedUserId });
        }

        socket.on("connect", () => {
            if (storedRoomId && storedUserId) {
                socket.emit("rejoin-room", { roomId: storedRoomId, userId: storedUserId });
            }
        });

        socket.on("player-request-to-restart", (data) => {
            setRequestRestart(true);
            setPlayerRequestRestart(data.playerRequest);
        });

        socket.on("game-state", (data) => {
            setArray(data.arrayPartida);
            setTurno(data.jugadorTurno);
            setPlayer1(data.player1);
            setPlayer2(data.player2);
            setJuego(true);
        });

        socket.on("room-not-found", (data) => {
            setRoomNotFound(data.state);
            setTimeout(() => {
                setRoomNotFound(false);
            }, 2000);
        });

        socket.on("room-created", (data) => {
            setNickname(data.nickname);
            setRoomId(data.roomId);
            localStorage.setItem("roomId", data.roomId);
            setUserId(data.userId);
            socket.emit("join-room", { roomId: data.roomId, nickname: data.nickname, userId: data.userId });
        });

        socket.on("start-game", (data) => {
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

        socket.on("move-made-by-ia", (data) => {
            setArray(data.arrayPartida);
            setTurno(data.jugadorTurno);
        });

        socket.on("game-won", (data) => {
            setGanador(data.ganador);

            if (data.winnerId === player1) {
                setNumberWinsP1((prev) => {
                    const updated = prev + 1;
                    localStorage.setItem("numberWinsP1", updated.toString());
                    return updated;
                });
            } else if (data.winnerId === player2) {
                setNumberWinsP2((prev) => {
                    const updated = prev + 1;
                    localStorage.setItem("numberWinsP2", updated.toString());
                    return updated;
                });
            }

            setPartida(data.partida);
        });

        socket.on("game-restarted", (data) => {
            setRestartRequested(false);
            setRequestRestart(false);
            setPlayerRequestRestart("");
            setGanador("");
            setEmpate(false);
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
            socket.off("room-not-found");
            socket.off("game-players");
            socket.off("room-created");
            socket.off("room-joined");
            socket.off("start-game");
            socket.off("move-made");
            socket.off("game-won");
            socket.off("game-restarted");
            socket.off("game-finished");
            socket.off("connect");
            socket.off("room-left");
            socket.off("game-state");
        };
    }, []);

    useEffect(() => {
        const newArray = array.map((elem) => {
            if (elem === "1") {
                return <RxCircle className="text-blue-500 size-14  xl:size-16"></RxCircle>;
            } else if (elem === "0") {
                return <RxCross2 className="text-red-400 size-14 xl:size-16 "></RxCross2>;
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
                        <Turno signo={<RxCircle className="text-blue-500 size-8  xl:size-14"></RxCircle>} jugadorNombre={player1} seleccionado={turno}></Turno>
                        <Tablero tabla={arrayRenderized} marcar={marcarCasilla} array={arrayRenderized} turno={turno} numberWinsP1={numberWinsP1} numberWinsP2={numberWinsP2}></Tablero>
                        <Turno signo={<RxCross2 className="text-red-400 size-8 xl:size-14"></RxCross2>} jugadorNombre={player2} seleccionado={turno}></Turno>
                        {playerLeft && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/80 text-[#D4C9BE] px-4">
                                <span className="text-3xl font-bold text-center">El otro jugador abandonó la sala</span>
                                <button
                                    onClick={() => {
                                        leaveRoom();
                                        setPlayerLeft(false);
                                    }}
                                    className="px-6 py-2 text-lg font-semibold text-black transition-transform duration-300 ease-in-out transform bg-[#D4C9BE] rounded-full shadow-lg hover:scale-105 hover:bg-gray-100 active:scale-95 animate-pulse cursor-pointer"
                                >
                                    Volver
                                </button>
                            </div>
                        )}
                        <button
                            className=" text-xl col-start-2   lg:absolute bottom-5 right-10 text-red-500 font-bold animate-pulse hover:animate-none transition-transform hover:scale-125 hover:text-red-700 cursor-pointer  duration-500   "
                            onClick={() => {
                                leaveRoom();
                            }}
                        >
                            Abandonar
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 p-4  justify-center items-center">
                        <h2 className="absolute top-2 left-5 z-0 text-[#D4C9BE] font-semibold text-2xl">{nickname}</h2>
                        <button
                            className={
                                "absolute  top-10 left-5 text-[10px]  hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-120 text-[#D4C9BE] font-semibold"
                            }
                            onClick={() => {
                                setNickname("");
                            }}
                        >
                            Cambiar Nickname
                        </button>
                        <button
                            className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-120  text-[#D4C9BE] font-semibold"
                            onClick={() => gameVSIA()}
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
                                        className="bg-slate-800 text-[#D4C9BE] placeholder-gray-400 rounded-lg w-full py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-inner border border-slate-600"
                                        type="text"
                                        placeholder="Código de sala"
                                        ref={refRoom}
                                        onClick={(e) => e.stopPropagation()}
                                    />

                                    <button
                                        className="bg-[#123458] cursor-pointer text-[#D4C9BE] text-base font-medium w-full py-3 rounded-xl hover:bg-[#145ea8] transition transform hover:scale-105"
                                        onClick={() => {
                                            if (refRoom.current) {
                                                setRoomId(refRoom.current.value);
                                                localStorage.setItem("roomId", refRoom.current.value);

                                                socket.emit("join-room", {
                                                    roomId: refRoom.current.value,
                                                    nickname: nickname,
                                                    userId: userId,
                                                });
                                            }
                                        }}
                                    >
                                        Unirse
                                    </button>
                                    {roomNotFound && <span className="text-red-400">No se encontro la Sala.</span>}
                                </span>
                            </div>
                        )}
                        {ventanaCrear && (
                            <div className="bg-black/60 z-10 backdrop-blur-sm fixed inset-0 flex justify-center items-center" onClick={() => leaveCreateRoom()}>
                                <span
                                    className="bg-white/10 backdrop-blur-md z-30 px-8 py-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center gap-6 border border-white/20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <p className="text-3xl font-bold text-[#D4C9BE]">Creación de Sala</p>

                                    <span
                                        className="bg-slate-800 text-[#D4C9BE] text-center font-mono tracking-widest rounded-lg w-full py-3 px-4 text-sm shadow-inner border border-slate-600 select-all"
                                        ref={refRoom}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {roomId || "-------- ---- ---- ---- ------------"}
                                    </span>

                                    <button
                                        className="bg-[#123458] cursor-pointer text-[#D4C9BE] text-base font-medium w-full py-3 rounded-xl hover:bg-[#145ea8] transition transform hover:scale-105"
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
                                        <p className="text-[#D4C9BE] text-sm text-center">¡Comparte este código con tu amigo!</p>
                                        <div className="flex gap-3 justify-center items-center">
                                            <p className="text-[#D4C9BE] text-sm text-center ">Esperando Jugadores </p>
                                            <BallTriangle className="w-6" />
                                        </div>
                                        <p className="text-[#D4C9BE] text-sm text-center ">No abandones esta ventana! </p>
                                    </div>
                                </span>
                            </div>
                        )}
                    </div>
                )
            ) : (
                <span className="flex flex-col    justify-center items-center text-[#D4C9BE]  text-lg  font-semibold  ">
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
                        {!requestRestart ? (
                            <span className="border flex flex-col gap-3 relative  p-10 rounded-sm  ">
                                {!restartRequested ? (
                                    <div>
                                        <h1 className="text-2xl  ">GANÓ {ganador}!</h1>
                                        <button className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-125 " onClick={requestRestartGame}>
                                            REINICIAR PARTIDA
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center ">
                                        <h4 className="text-[#D4C9BE] text-xl text-center ">Se envio la solicitud </h4>
                                        <span className="flex gap-3 justify-center items-center">
                                            <p className="text-[#D4C9BE] text-sm text-center ">Esperando Confirmación </p>
                                            <BallTriangle className="w-6" />
                                        </span>
                                        <button
                                            className="text-red-500 font-bold animate-pulse hover:animate-none transition-transform hover:scale-105 hover:text-red-700 text-sm absolute bottom-2 right-2 cursor-pointer  duration-500  "
                                            onClick={leaveRoom}
                                        >
                                            Abandonar
                                        </button>
                                    </div>
                                )}
                            </span>
                        ) : (
                            <span className="border border-neutral-300  shadow-md rounded-lg p-8 flex flex-col gap-6 items-center">
                                <h1 className="text-2xl font-semibold text-[#D4C9BE] text-center">{playerRequestRestart} quiere volver a jugar</h1>
                                <span className="flex gap-6 justify-center items-center">
                                    <button className="text-green-600 font-bold animate-pulse hover:animate-none transition-transform hover:scale-125 hover:text-green-800" onClick={restartGame}>
                                        Volver a Jugar
                                    </button>
                                    <button className="text-red-500 font-bold animate-pulse hover:animate-none transition-transform hover:scale-125 hover:text-red-700" onClick={leaveRoom}>
                                        Abandonar
                                    </button>
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            )}

            {empate && (
                <div className="absolute top-0 left-0 flex   w-screen h-screen  bg-black/90 ">
                    <div className="relative w-full h-full  text-[#D4C9BE] font-semibold flex flex-col  justify-center items-center ">
                        {!requestRestart ? (
                            <span className="border flex flex-col gap-3 relative  p-10 rounded-sm  ">
                                {!restartRequested ? (
                                    <div>
                                        <h1 className="text-2xl  ">EMPATE</h1>
                                        <button className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-125 " onClick={requestRestartGame}>
                                            REINICIAR PARTIDA
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center ">
                                        <h4 className="text-[#D4C9BE] text-xl text-center ">Se envio la solicitud </h4>
                                        <span className="flex gap-3 justify-center items-center">
                                            <p className="text-[#D4C9BE] text-sm text-center ">Esperando Confirmación </p>
                                            <BallTriangle className="w-6" />
                                        </span>
                                        <button
                                            className="text-red-500 font-bold animate-pulse hover:animate-none transition-transform hover:scale-105 hover:text-red-700 text-sm absolute bottom-2 right-2 cursor-pointer  duration-500  "
                                            onClick={leaveRoom}
                                        >
                                            Abandonar
                                        </button>
                                    </div>
                                )}
                            </span>
                        ) : (
                            <span className="border border-neutral-300  shadow-md rounded-lg p-8 flex flex-col gap-6 items-center">
                                <h1 className="text-2xl font-semibold text-[#D4C9BE] text-center">{playerRequestRestart} quiere volver a jugar</h1>
                                <span className="flex gap-6 justify-center items-center">
                                    <button className="text-green-600 font-bold animate-pulse hover:animate-none transition-transform hover:scale-125 hover:text-green-800" onClick={restartGame}>
                                        Volver a Jugar
                                    </button>
                                    <button className="text-red-500 font-bold animate-pulse hover:animate-none transition-transform hover:scale-125 hover:text-red-700" onClick={leaveRoom}>
                                        Abandonar
                                    </button>
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
