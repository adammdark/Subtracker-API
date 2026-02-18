import mongoose from "mongoose";
import { DB_URI,NODE_ENV } from "../config/env.js";

const connectToDatabse = async()=>{

    if(!DB_URI){
        throw new Error('Please define the MONGODB_URI environment variable insid .env<production/developement>.local')
    }

    try{

        await mongoose.connect(DB_URI);
        console.log(`MongoDB connected successfuly in ${NODE_ENV} mode`);
    }
    catch(error){

        console.log(`Error to connecting databas ${error}`);
        process.exit(1);
    }
}

export default connectToDatabse;

