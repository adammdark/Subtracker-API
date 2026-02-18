import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        minLength:2,
        maxLength:50,
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        lowerCase:true,
        trim:true,
        minLength:5,
        maxLength:255,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'Please enter a valid email address']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minLength:6,
    },
},{timestamps:true})

export default mongoose.model('User',userSchema);