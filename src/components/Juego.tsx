import { ReactNode, useState } from "react";
import Tablero from "./Tablero";
import "./css/Juego.css";
import Turno from "./Turno";


export default function Juego() {
    type Jugadores = "jugador1" | "jugador2";
    let [turno, setTurno] = useState<Jugadores>("jugador1");
    let [arrayRend, setArrayRend] = useState(Array(9).fill(null));
    let [array, setArray] = useState(Array(9).fill(null));
    let [juegoIniciado, setJuego] = useState<boolean>(false);
    let [partida, setPartida] = useState<boolean>(false);
    let [ganador, setGanador] = useState<string>("");
    let [empate, setEmpate] = useState<boolean>(false);
    const circle =  <svg version="1.1" id="circle" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"  viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="8" fill="#0074ba"/>
                    </svg>
    const cross =   <svg version="1.1" id="cross" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 11 11" >
                        <path d="M2.2,1.19l3.3,3.3L8.8,1.2C8.9314,1.0663,9.1127,0.9938,9.3,1C9.6761,1.0243,9.9757,1.3239,10,1.7&#xA;&#x9;c0.0018,
                        0.1806-0.0705,0.3541-0.2,0.48L6.49,5.5L9.8,8.82C9.9295,8.9459,10.0018,9.1194,10,9.3C9.9757,9.6761,9.6761,9.9757,9.3,10&#xA;&#x9;
                        c-0.1873,0.0062-0.3686-0.0663-0.5-0.2L5.5,6.51L2.21,9.8c-0.1314,0.1337-0.3127,0.2062-0.5,0.2C1.3265,9.98,1.02,9.6735,1,9.29&#xA;&#x9;
                        C0.9982,9.1094,1.0705,8.9359,1.2,8.81L4.51,5.5L1.19,2.18C1.0641,2.0524,0.9955,1.8792,1,1.7C1.0243,1.3239,1.3239,1.0243,1.7,1&#xA;&#x9;
                        C1.8858,0.9912,2.0669,1.06,2.2,1.19z" fill="#f92f60"/>
                    </svg>

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
                console.log("ganaste")
                return true
            }
        }
        return false
    };

    const checkearEmpate = (array:ReactNode[]) => {
        for (const elem of array){
            if (elem === null){
                return
            }
        }
        setEmpate(true)
    }

    function marcarCasilla(celda: number) {
        const turnoJugador: Jugadores = turno;
        if (arrayRend[celda] != null) {
            return;
        }
        const nuevoArrayRend = [...arrayRend];
        const nuevoArray = [...array];
        if (turno === "jugador1") {
            nuevoArrayRend[celda] = circle
            nuevoArray[celda] = "🔵"
            setTurno("jugador2");
        } else {
            nuevoArrayRend[celda] =  cross
            nuevoArray[celda] = "❌"
            setTurno("jugador1");
        }
        setArrayRend(nuevoArrayRend);
        setArray(nuevoArray);
        const gano:boolean = checkearVictoria(nuevoArray, turnoJugador);
        if (!gano){
            checkearEmpate(nuevoArray)
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
        <>
            <h1 className="titulo">TIC-TAC-TOE</h1>
            {juegoIniciado ? (
                <div className="contenedorTablero">
                        <Tablero tabla={arrayRend} marcar={marcarCasilla} array={arrayRend}></Tablero>
                            <Turno signo={circle} classNameP="seleccionado" jugadorNombre="JUGADOR 1" seleccionado={turno} jugador="jugador1"></Turno>
                            <Turno signo={cross} classNameP="seleccionado" jugadorNombre="JUGADOR 2" seleccionado={turno} jugador="jugador2"></Turno> 
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
