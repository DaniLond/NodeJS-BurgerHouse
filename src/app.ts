import express, {Express} from 'express';
import { db } from './lib/connectionDB';
import { userRouter } from './routes/user.routes';
import { productRouter } from './routes/product.routes';
import orderRoutes  from "./routes/order.route";

const app: Express = express();

const PORT= process.env.PORT;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRoutes);

db.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on ${PORT} port`);
    })
})
