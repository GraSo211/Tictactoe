import Celda from "./Celda";

type Props = {
    tabla: Array<number | string>;
    marcar: (celda: number) => void;
    array: Array<string>;
    turno: string;
    numberWinsP1?: number;
    numberWinsP2?: number;
};

export default function Tablero({ tabla, marcar, array, turno, numberWinsP1, numberWinsP2 }: Props) {
    
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
            <span className="text-white mt-5">
                <h4 className="text-2xl font-semibold">MARCADOR</h4>
                <p className="font-bold text-lg"><span className="text-blue-500 "> {numberWinsP1 || 0}</span> - <span className="text-red-500 "> {numberWinsP2 || 0}</span> </p>
            </span>
        </div>
    );
}
