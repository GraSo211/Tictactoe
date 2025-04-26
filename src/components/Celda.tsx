
type Props = {
    index: number;
    marcar: (celda:number)=>void;
    array: Array<string>;
}
export default function Celda({index, marcar, array}:Props){

    return(<>
    <div className="flex bg-black min-h-full min-w-full  justify-center items-center " id={"c"+index} onClick={()=> marcar(index)}> 
        <p className=" w-fit h-fit">
            {array[index]}
        </p>
    </div>
    </>);
}
