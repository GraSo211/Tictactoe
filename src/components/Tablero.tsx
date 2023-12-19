import "./css/Tablero.css";
import Celda from "./Celda";

type Props = {
    tabla: Array<number | string>;
    marcar: (celda:number)=>void
    array: Array<string>;
};

export default function Tablero({ tabla, marcar, array }: Props) {

    return (
        <>
            <div className="tablero">
                {
                    tabla.map((_, filaIndex)=>{
                        return <Celda key={filaIndex} index={filaIndex} marcar={marcar} array={array}></Celda>
                            
                    })
                }
            </div>
        </>
    );
}
