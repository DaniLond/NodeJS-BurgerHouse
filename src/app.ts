import express, {Express} from 'express';
import { json } from 'stream/consumers';

const app: Express = express();

const port:number = 4000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());


app.listen(port, ()=>{
    console.log(`Server is running on ${port} port`);
})

