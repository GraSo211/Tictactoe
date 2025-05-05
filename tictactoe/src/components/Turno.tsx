
import { ReactNode } from "react";



type Props = {
    signo: ReactNode;
    jugadorNombre: string;
    seleccionado: string;
    jugador: string;
}

export default function Turno({signo,  jugadorNombre, seleccionado, jugador}:Props){

    return(
        <>
            <div className={"self-start flex gap-2 flex-col justify-center items-center border text-[#D4C9BE] py-4 px-8 rounded-md  "}>
                <h3 className=" font-bold " >{jugadorNombre}</h3>
                <div className={seleccionado === jugador ? "p-1 bg-[#123458] border-gray-800 border  rounded-2xl" : "p-1  border border-transparent  rounded-2xl "}>
                    <p className="">{signo}</p>
                </div>
            </div>
        </>
    );
}