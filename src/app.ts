import express, {Express} from 'express';
import { json } from 'stream/consumers';
import { db } from './lib/connectionDB';

const app: Express = express();

const PORT= process.env.PORT;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

db.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on ${PORT} port`);
    })
})
