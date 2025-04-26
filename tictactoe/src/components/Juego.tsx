import { ReactNode, useState } from "react";
import Tablero from "./Tablero";
import Turno from "./Turno";
import { RxCircle } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";




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

    // Posibles combinaciones de victoria
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

    // * Funcion para checkear si algun jugador gano. Checked
    const checkVictoria = (array: ReactNode[], turno: Jugadores) => {
        for (const arrayGanador of victoria) {
            const [a, b, c] = arrayGanador;
            if (array[a] && array[a] === array[b] && array[a] === array[c]) {
                setPartida(true);
                const jugador = turno === "p1" ? "JUGADOR 1" : "JUGADOR 2";
                setGanador(jugador);
                return true;
            }
        }
        return false;
    };

    // * Se checkea si hay empate. Checked
    const checkearEmpate = (array: ReactNode[]) => {
        for (const elem of array) {
            if (elem === null) {
                return;
            }
        }
        setEmpate(true);
    };

    // * Funcion para marcar la casilla seleccionada.
    function marcarCasilla(celda: number) {
        // obtenemos de quien es el turnoa actual.
        const turnoJugador: Jugadores = turno;

        // Si el jugador toco una celda ya ocupada, no se hace nada.
        if (arrayRenderized[celda] != null) {
            return;
        }

        // Creamos un nuevo array renderized para modificar el estado y que se refleje en la UI.
        const nuevoarrayRenderized = [...arrayRenderized];

        // Creamos un nuevo array para modificar el estaod de la partida.
        const nuevoArray = [...array];

        // En el turno del jugador 1, se coloca el svg en el array renderized, se pone un 1 a su celda marcada y se cambia el turno al jugador 2. Para el jugador 2 se hace lo mismo pero con un 0.
        if (turno === "p1") {
            nuevoarrayRenderized[celda] = circle;
            nuevoArray[celda] = "1";
            setTurno("p2");
        } else {
            nuevoarrayRenderized[celda] = cross;
            nuevoArray[celda] = "0";
            setTurno("p1");
        }
        // Se actualizan los estados de la UI y del array.
        setarrayRenderized(nuevoarrayRenderized);
        setArray(nuevoArray);

        // Se checkea victoria y empate.
        const gano: boolean = checkVictoria(nuevoArray, turnoJugador);
        if (!gano) {
            checkearEmpate(nuevoArray);
        }
    }

    // * Funcion para reiniciar el juego. Checked
    function reiniciarPartida() {
        setTurno("p1");
        setarrayRenderized(Array(9).fill(null));
        setArray(Array(9).fill(null));
        setPartida(false);
        setEmpate(false);
    }

    return (
        <div className="flex flex-col h-full justify-center text-center ">
            <h1 className="text-[#D4C9BE] text-6xl font-semibold my-5  ">TIC-TAC-TOE</h1>
            {juegoIniciado ? (
                <div className=" w-full h-full grid grid-cols-[1fr_2fr_1fr]  place-items-center  ">
                    <Turno signo={circle}  jugadorNombre="JUGADOR 1" seleccionado={turno} jugador="p1"></Turno>
                    <Tablero tabla={arrayRenderized} marcar={marcarCasilla} array={arrayRenderized}></Tablero>

                    <Turno signo={cross}  jugadorNombre="JUGADOR 2" seleccionado={turno} jugador="p2"></Turno>
                </div>
            ) : (
                <div className="iniciarPartida">
                    <button className=" hover:text-gray-600  cursor-pointer animate-pulse hover:animate-none transition-transform hover:scale-125 text-[#D4C9BE] font-semibold" onClick={() => setJuego(true)}>
                        INICIAR JUEGO
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
