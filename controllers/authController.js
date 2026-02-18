import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { JWT_SECRET,JWT_EXPIRY } from "../config/env.js";

const signUp = async(req,res,next)=>{

    try{

        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUsers = await User.create([{name,email,password:hashedPassword}]);
        const token = jwt.sign({userId:newUsers[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRY});

        res.status(201).json({
            success:true,
            message:'User created successfully',
            data:{
                token,
                user:newUsers[0]
            }
        })
    }
    catch(error){
        next(error);
    }
}

const signIn = async(req,res,next)=>{

    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){

            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPassowordValid = await bcrypt.compare(password,user.password);

        if(!isPassowordValid){

            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRY});
        res.status(200).json({
            success:true,
            message:'User signed in successfully',
            data:{
                token,
                user:user
            }
        });
    }
    catch(error){
        next(error);
    }
}

const signOut = async(req,res,next)=>{

    
}

export {signUp,signIn,signOut};