import Celda from "./Celda";

type Props = {
    tabla: Array<number | string>;
    marcar: (celda: number) => void;
    array: Array<string>;
    turno: string;
};

export default function Tablero({ tabla, marcar, array, turno }: Props) {
    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <span className="flex flex-col gap-1">
                <h4 className="text-[#D4C9BE] font-bold text-2xl">Turno</h4>
                <p className="text-[#D4C9BE]    font-semibold">{turno}</p>
            </span>

            <div className=" bg-[#D4C9BE]   grid  grid-cols-3 grid-rows-3 gap-[2px] 2xl:gap-[1px]  size-[250px] 2xl:size-[500px]  ">
                {tabla.map((_, filaIndex) => {
                    return <Celda key={filaIndex} index={filaIndex} marcar={marcar} array={array}></Celda>;
                })}
            </div>
        </div>
    );
}
