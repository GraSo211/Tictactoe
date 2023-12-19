import "./css/Celda.css"
type Props = {
    index: number;
    marcar: (celda:number)=>void;
    array: Array<string>;
}
export default function Celda({index, marcar, array}:Props){

    return(<>
    <div className="celda" id={"c"+index} onClick={()=> marcar(index)}> 
        <p className="simbolo">
            {array[index]}
        </p>
    </div>
    </>);
}
