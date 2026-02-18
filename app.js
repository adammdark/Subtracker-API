import express from "express";
import { PORT, SERVER_URL } from "./config/env.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import subscriptionRouter from "./routes/subscsriptionRouter.js";
import connectToDatabse from "./database/mongodb.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjetMiddleware.js";
import workflowRouter from "./routes/workflowRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(arcjetMiddleware)

app.get("/",(req,res)=>{

    res.send("Welcome to Sub tracker");
})

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);  
app.use('/api/v1/subscriptions',subscriptionRouter);
app.use('/api/v1/workflows',workflowRouter);

app.use(errorMiddleware)

app.listen(PORT,async ()=>{

    console.log(`Sub tracker API is running on ${SERVER_URL}`);
    await connectToDatabse();  
})