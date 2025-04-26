import { ReactNode, useState } from "react";
import Tablero from "./Tablero";
import Turno from "./Turno";
import { RxCircle } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
export default function Juego() {
    type Jugadores = "jugador1" | "jugador2";
    let [turno, setTurno] = useState<Jugadores>("jugador1");
    let [arrayRend, setArrayRend] = useState(Array(9).fill(null));
    let [array, setArray] = useState(Array(9).fill(null));
    let [juegoIniciado, setJuego] = useState<boolean>(false);
    let [partida, setPartida] = useState<boolean>(false);
    let [ganador, setGanador] = useState<string>("");
    let [empate, setEmpate] = useState<boolean>(false);
    const circle = <RxCircle className="text-blue-500" size={100}></RxCircle>;
    const cross = <RxCross2 className="text-red-400" size={100}></RxCross2>;

    const victoria = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
    ];

    const checkearVictoria = (array: ReactNode[], turno: Jugadores) => {
        for (const arrayGanador of victoria) {
            const [a, b, c] = arrayGanador;
            if (array[a] && array[a] === array[b] && array[a] === array[c]) {
                setPartida(true);
                const jugador = turno === "jugador1" ? "JUGADOR 1" : "JUGADOR 2";
                setGanador(jugador);
                console.log("ganaste");
                return true;
            }
        }
        return false;
    };

    const checkearEmpate = (array: ReactNode[]) => {
        for (const elem of array) {
            if (elem === null) {
                return;
            }
        }
        setEmpate(true);
    };

    function marcarCasilla(celda: number) {
        const turnoJugador: Jugadores = turno;
        if (arrayRend[celda] != null) {
            return;
        }
        const nuevoArrayRend = [...arrayRend];
        const nuevoArray = [...array];
        if (turno === "jugador1") {
            nuevoArrayRend[celda] = circle;
            nuevoArray[celda] = "🔵";
            setTurno("jugador2");
        } else {
            nuevoArrayRend[celda] = cross;
            nuevoArray[celda] = "❌";
            setTurno("jugador1");
        }
        setArrayRend(nuevoArrayRend);
        setArray(nuevoArray);
        const gano: boolean = checkearVictoria(nuevoArray, turnoJugador);
        if (!gano) {
            checkearEmpate(nuevoArray);
        }
    }

    function reiniciarPartida() {
        setTurno("jugador1");
        setArrayRend(Array(9).fill(null));
        setArray(Array(9).fill(null));
        setPartida(false);
        setEmpate(false);
    }

    return (
        <div className="flex flex-col justify-center text-center ">
            <h1 className="text-white text-8xl font-semibold  ">TIC-TAC-TOE</h1>
            {juegoIniciado ? (
                <div className=" w-full grid grid-cols-[1fr_2fr_1fr]  place-items-center ">
                    
                    <Turno signo={circle} classNameP="seleccionado" jugadorNombre="JUGADOR 1" seleccionado={turno} jugador="jugador1"></Turno>
                    <Tablero tabla={arrayRend} marcar={marcarCasilla} array={arrayRend}></Tablero>
                    
                    <Turno signo={cross} classNameP="seleccionado" jugadorNombre="JUGADOR 2" seleccionado={turno} jugador="jugador2"></Turno>
                </div>
            ) : (
                <div className="iniciarPartida">
                    <button className=" text-blue-600" onClick={() => setJuego(true)}>
                        INICIAR JUEGO
                        <span></span>
                    </button>
                </div>
            )}

            {partida ? (
                <div className="final">
                    <div className="cuadrado">
                        <h1 className="finalMsj">GANO EL {ganador}</h1>
                        <button className="boton" onClick={reiniciarPartida}>
                            REINICIAR PARTIDA
                        </button>
                    </div>
                </div>
            ) : null}

            {empate ? (
                <div className="final">
                    <div className="cuadrado">
                        <h1 className="finalMsj">EMPATE</h1>
                        <button className="" onClick={reiniciarPartida}>
                            REINICIAR PARTIDA
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
