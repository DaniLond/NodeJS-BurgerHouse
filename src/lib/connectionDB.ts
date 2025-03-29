import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL:string = process.env.MONGODB_URL || "";

export const db = mongoose.connect(MONGO_URL, { dbName:"db_burger_house" })
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((error)=>{
    console.log(error)
})