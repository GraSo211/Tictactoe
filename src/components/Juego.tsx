import { useState } from "react";
import Tablero from "./Tablero";
import "./css/Juego.css";
import Turno from "./Turno";

export default function Juego() {
    type Jugadores = "jugador1" | "jugador2";
    let [turno, setTurno] = useState<Jugadores>("jugador1");
    let [array, setArray] = useState(Array(9).fill(null));
    let [juegoIniciado, setJuego] = useState<boolean>(false);
    let [partida, setPartida] = useState<boolean>(false);
    let [ganador, setGanador] = useState<string>("");
    let [empate, setEmpate] = useState<boolean>(false);

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

    const checkearVictoria = (array: string[], turno: Jugadores) => {
        for (const arrayGanador of victoria) {
            const [a, b, c] = arrayGanador;
            if (array[a] && array[a] === array[b] && array[a] === array[c]) {
                setPartida(true);
                const jugador = turno === "jugador1" ? "JUGADOR 1" : "JUGADOR 2";
                setGanador(jugador);
                return true
            }
        }
        return false
    };

    const checkearEmpate = (array:string[]) => {
        for (const elem of array){
            if (elem === null){
                return
            }
        }
        setEmpate(true)
    }

    function marcarCasilla(celda: number) {
        const turnoJugador: Jugadores = turno;
        if (array[celda] != null) {
            return;
        }
        const nuevoArray = [...array];
        if (turno === "jugador1") {
            nuevoArray[celda] = "🔵";
            setTurno("jugador2");
        } else {
            nuevoArray[celda] = "❌";
            setTurno("jugador1");
        }
        setArray(nuevoArray);
        const gano:boolean = checkearVictoria(nuevoArray, turnoJugador);
        if (!gano){
            checkearEmpate(nuevoArray)
        }
        
    }

    function reiniciarPartida() {
        console.log("reiniciamos");
        setTurno("jugador1");
        setArray(Array(9).fill(null));
        setPartida(false);
        setEmpate(false);
    }

    return (
        <>
            <h1 className="titulo">TIC-TAC-TOE</h1>
            {juegoIniciado ? (
                <div className="contenedorTablero">
                        <Tablero tabla={array} marcar={marcarCasilla} array={array}></Tablero>
                            <Turno signo="🔵" classNameP="seleccionado" jugadorNombre="JUGADOR 1" seleccionado={turno} jugador="jugador1"></Turno>
                            <Turno signo="❌" classNameP="seleccionado" jugadorNombre="JUGADOR 2" seleccionado={turno} jugador="jugador2"></Turno> 
                       
                       
                </div>
            ) : (
                <div className="iniciarPartida">
                    <button className="boton" onClick={() => setJuego(true)}>
                        INICIAR JUEGO
                        <span></span>
                        <span></span>
                        <span></span>
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
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            ) : null}

            {empate ? (
                <div className="final">
                    <div className="cuadrado">
                        <h1 className="finalMsj">EMPATE</h1>
                        <button className="boton" onClick={reiniciarPartida}>
                            REINICIAR PARTIDA
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            ) : null }
        </>
    );
}
