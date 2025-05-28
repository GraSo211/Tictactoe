
import { ReactNode } from "react";



type Props = {
    signo: ReactNode;
    jugadorNombre: string;
    seleccionado: string;
    
}

export default function Turno({signo,  jugadorNombre, seleccionado}:Props){

    return(
        <>
            <div className={"self-start flex gap-2 flex-col justify-center items-center  text-[#D4C9BE]    "}>
                <h3 className=" font-bold " >{jugadorNombre}</h3>
                <div className={seleccionado === jugadorNombre ? "p-1  bg-[#111110] border-gray-800 border  rounded-2xl" : "p-1  border border-transparent  rounded-2xl "}>
                    <span className="">{signo}</span>
                </div>
            </div>
            
        </>
    );
}