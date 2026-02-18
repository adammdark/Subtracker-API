import { Router } from "express";
import { cancelSubscription, createSubscription, deleteSubscription, getUserSubscriptions, subscriptionDetails, updateSubscription } from "../controllers/subscriptionContorller.js";
import { authorize } from "../middlewares/authMiddleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/',(req,res)=>{
    res.send({title:"GET all subscriptions"})
});

subscriptionRouter.get('/:id',authorize,subscriptionDetails);

subscriptionRouter.post('/',authorize,createSubscription);

subscriptionRouter.put('/:id',authorize,updateSubscription);

subscriptionRouter.delete('/:id',authorize,deleteSubscription);

subscriptionRouter.get('/user/:id',authorize,getUserSubscriptions);

subscriptionRouter.put('/:id/cancel',authorize,cancelSubscription);


export default subscriptionRouter;
