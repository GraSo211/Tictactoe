
import { ReactNode } from "react";

type Jugadores = "P1" | "P2";

type Props = {
    signo: ReactNode;
    jugadorNombre: string;
    seleccionado: Jugadores;
    jugador: Jugadores;
}

export default function Turno({signo,  jugadorNombre, seleccionado, jugador}:Props){

    return(
        <>
            <div className={"self-start flex flex-col justify-center items-center border text-[#D4C9BE] p-8 rounded-md  "}>
                <h3 className=" font-bold" >{jugadorNombre}</h3>
                <div className={seleccionado === jugador ? "p-1 bg-[#123458] border-gray-800 border  rounded-2xl" : "p-1  border border-transparent  rounded-2xl "}>
                    <p className="">{signo}</p>
                </div>
            </div>
        </>
    );
}