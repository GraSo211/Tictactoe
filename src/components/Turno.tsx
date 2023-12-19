import "./css/Turno.css"

type Jugadores = "jugador1" | "jugador2";

type Props = {
    signo: string;
    classNameP: string;
    jugadorNombre: string;
    seleccionado: Jugadores;
    jugador: Jugadores;
}

export default function Turno({signo, classNameP, jugadorNombre, seleccionado, jugador}:Props){
    const className = classNameP
    return(
        <>
            <div className={"contenedorTurnoJugador"}>
                <p className="turnoJugador" >{jugadorNombre}</p>
                <div className={seleccionado === jugador ? "contenedorSigno " + className : "contenedorSigno"}>
                    <p className="signo">{signo}</p>
                </div>
            </div>
        </>
    );
}