import mongoose from "mongoose";
import { ENV } from "./env.js";


export const connectDb = async()=>{
    try {
        await mongoose.connect(ENV.MONGO_URI)
        console.log(`database connected`)
    } catch (error) {
        console.log(`error from connectDb , ${error}`)
    }
}