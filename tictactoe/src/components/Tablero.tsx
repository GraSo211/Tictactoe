
import Celda from "./Celda";

type Props = {
    tabla: Array<number | string>;
    marcar: (celda:number)=>void
    array: Array<string>;
};

export default function Tablero({ tabla, marcar, array }: Props) {

    return (
        <>
            <div className=" bg-[#D4C9BE]   grid  grid-cols-3 grid-rows-3 gap-[2px] 2xl:gap-[1px]  size-[250px] 2xl:size-[500px]  ">
                {
                    tabla.map((_, filaIndex)=>{
                        return <Celda key={filaIndex} index={filaIndex} marcar={marcar} array={array}></Celda>
                            
                    })
                }
            </div>
        </>
    );
}
