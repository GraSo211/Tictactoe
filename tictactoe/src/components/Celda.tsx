
type Props = {
    index: number;
    marcar: (celda:number)=>void;
    array: Array<string>;
}
export default function Celda({index, marcar, array}:Props){

    return(<>
    <div className="flex bg-[#030303] min-h-full min-w-full  justify-center items-center hover:bg-[#222841] transition-colors duration-300" id={"c"+index} onClick={()=> marcar(index)}> 
        <p className=" w-fit h-fit">
            {array[index]}
        </p>
    </div>
    </>);
}
