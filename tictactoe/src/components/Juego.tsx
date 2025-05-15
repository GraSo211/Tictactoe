import { ReactNode, use, useEffect, useRef, useState } from "react";
import Tablero from "./Tablero";
import Turno from "./Turno";
import { RxCircle } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";

import socket from "../socket.js";




export default function Juego() {

    const refNickname = useRef<HTMLInputElement>(null);
    const [nickname, setNickname] = useState<string>("");

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




    // Salas
    const createRoom = () => {
        console.log(nickname)
        socket.emit("create-room", {nickname:nickname});
    }

    const joinRoom = () => {
        console.log("hola:",nickname)
        socket.emit("join-room", {
            roomId:roomId,
            nickname:nickname,
        });
    };

    // Partida
    const reiniciarPartida = () => {
        socket.emit("restart-game");
    };

    const marcarCasilla = (index: number) => {
        socket.emit("make-move", { index: index });
    };



    useEffect(() => {


        socket.on("game-players",(data)=>{
            setPlayer1(data.player1);
            setPlayer2(data.player2);
        })

        socket.on("room-created", (data) => {
            setNickname(data.nickname);
            setRoomId(data.roomId);
            socket.emit("join-room", {roomId:data.roomId, nickname:data.nickname});
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
                    <Turno signo={circle} jugadorNombre={player1} seleccionado={turno} ></Turno>
                    <Tablero tabla={arrayRenderized} marcar={marcarCasilla} array={arrayRenderized}></Tablero>
                    <Turno signo={cross} jugadorNombre={player2} seleccionado={turno} ></Turno>
                </div>
            ) : (   
                <div className="flex flex-col gap-3 p-4  justify-center items-center">
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

                    <span className="flex flex-col gap-3 border  justify-center items-center text-[#D4C9BE] border-[#D4C9BE] p-2 rounded-sm text-md  font-semibold absolute bottom-10 left-10">
                        <p>Ingresa tu Nickname</p>
                        <span className="flex flex-col gap-1 text-xs justify-center items-center">
                            <input className="bg-slate-700 rounded-sm p-2" type="text" placeholder="Tu Nickname" ref={refNickname} />
                            <button className="cursor-pointer bg-[#123458]  p-2 rounded-xl hover:animate-none hover:scale-105  " onClick={()=>{setNickname(refNickname.current!.value) }}>Aceptar</button>
                            <p>{nickname}</p>
                        </span>
            
                    </span>

                    <span className="flex flex-col gap-3 border  justify-center items-center text-[#D4C9BE] border-[#D4C9BE] p-2 rounded-sm text-md  font-semibold absolute bottom-10 left-80">
                        <p>Ingresa la Sala</p>
                        <span className="flex flex-col gap-1 text-xs justify-center items-center">
                            <input className="bg-slate-700 rounded-sm p-2" type="text" placeholder="Codigo de sala" ref={refRoom} />
                            <button className="cursor-pointer bg-[#123458]  p-2 rounded-xl hover:animate-none hover:scale-105  " onClick={()=>{setRoomId(refRoom.current!.value) }}>Aceptar</button>
                        </span>
            
                    </span>
                    <span className="absolute text-white top-0 font-semibold right-60  ">Room: {roomId}</span>
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
