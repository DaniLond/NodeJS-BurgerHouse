import express, {Express} from 'express';
import { json } from 'stream/consumers';
import { db } from './lib/connectionDB';
import { userRouter } from './routes/user.routes';

const app: Express = express();

const PORT= process.env.PORT;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use("/users", userRouter);

db.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on ${PORT} port`);
    })
})
