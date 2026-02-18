import { Router } from "express";
import { getUserById, getUsers } from "../controllers/userController.js";
import { authorize } from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.get('/',getUsers);

userRouter.get('/:id',authorize,getUserById);

userRouter.post('/',(req,res)=>{
    res.send({title:"CREATE a new user"});
});

userRouter.put('/:id',(req,res)=>{
    res.send({title:"UPDATE a user"});
});

userRouter.delete('/:id',(req,res)=>{
    res.send({title:"DELETE a user"});
});

export default userRouter
