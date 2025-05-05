// * Funcion para checkear si algun jugador gano. Checked

type Jugadores = string;


let turno: Jugadores = "P1";
const setTurno = (jugador: Jugadores) => {
    turno = jugador;
}

let partida = false;
const setPartida = (estado:boolean)=>{
    partida = estado;
}


let ganador: Jugadores|"" = "";
const setGanador = (jugador:Jugadores)=>{
    ganador = jugador;
}



let empate = false;
const setEmpate = (estado:boolean)=>{
    empate = estado;
}


let arrayPartida = Array(9).fill(null);


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

const checkVictoria = (array: Number[], turno: Jugadores) => {
    for (const arrayGanador of victoria) {
        const [a, b, c] = arrayGanador;
        if (array[a] && array[a] === array[b] && array[a] === array[c]) {
            setPartida(true);
            const jugador = turno;
            setGanador(jugador);
            return true;
            
        }
    }
    return false;
};

// * Se checkea si hay empate. Checked
const checkearEmpate = (array: Number[]) => {
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
    if (arrayPartida[celda] != null) {
        return;
    }


    // En el turno del jugador 1, se coloca el svg en el array renderized, se pone un 1 a su celda marcada y se cambia el turno al jugador 2. Para el jugador 2 se hace lo mismo pero con un 0.
    if (turno === "P1") {
        arrayPartida[celda] = "1";
        setTurno("P2");
    } else {
        arrayPartida[celda] = "0";
        setTurno("P1");
    }

    // Se checkea victoria y empate.
    const hayGanador: boolean = checkVictoria(arrayPartida, turnoJugador);
    if (!hayGanador) {
        checkearEmpate(arrayPartida);
    }
}

// * Funcion para reiniciar el juego. Checked
function reiniciarPartida() {
    setTurno("P1");
    arrayPartida = Array(9).fill(null);
    setPartida(false);
    setEmpate(false);
}

export {turno, partida, ganador, empate, arrayPartida, marcarCasilla, reiniciarPartida};