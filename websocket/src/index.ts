import express from 'express';
import { Request, Response } from 'express';


const port = process.env.PORT || 3000;

const app = express();




app.get("/",(req: Request , res: Response)=>{
    res.send("Hello World!")
})



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

