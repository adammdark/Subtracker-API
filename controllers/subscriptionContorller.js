import { SERVER_URL } from '../config/env.js'
import { workflowClient } from '../config/upstash.js'
import Subscription from '../models/subscriptionModel.js'

export const createSubscription = async(req,res,next)=>{

    try{

        const subscription = await Subscription.create({
            ...req.body,
            user:req.user._id
        })

        const { workflowRunId } = await workflowClient.trigger({
            url:`${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body:{
                subscriptionId:subscription.id
            },
            headers:{
                'content-type':'application/json'
            },
            retries:0
        })

        res.status(201).json({
            success:true,
            data:{
                subscription,
                workflowRunId
            }
        })
    }
    catch(error){
        next(error);
    }
}
    
export const getUserSubscriptions = async(req,res,next)=>{

    try{

        if(!req.user.id === req.params.id){

            const error = new Error('You are not the owner of this account');
            error.statusCode = 401;
            throw error;

        }

        const subscriptions = await Subscription.find({user:req.user.id});
        res.status(200).json({
            success:true,
            data:subscriptions
        });
    }
    catch(error){
        next(error);
    }
}

export const subscriptionDetails = async(req,res,next)=>{

    try{

        const {name,price,currency,frequency,startDate,renewalDate,status} = await Subscription.findById(req.params.id);

        res.status(200).json({
            success:true,
            data:{
                name,
                price,
                currency,
                frequency,
                startDate,
                renewalDate,
                status
            }
        })
    }
    catch(error){
        next(error)
    }
}

export const updateSubscription = async(req,res,next)=>{
    
    try{
        
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {new:true});

        res.status(200).json({
            success:true,
            message:'Subscription updated successfully',
            data:subscription
        });
    }
    catch(error){
        next(error)
    }
}

export const deleteSubscription = async(req,res,next)=>{

    try{

        const subscription = await Subscription.findByIdAndDelete(req.params.id);  

        res.status(200).json({
            success:true,
            message:'Subscription deleted successfully'
        })

    }
    catch(error){
        next(error);
    }
}

export const cancelSubscription = async(req,res,next)=>{

    try{

       const subscription = await Subscription.findByIdAndUpdate(req.params.id,{ status: 'inactive' },{ new: true });

        res.status(200).json({
            success:true,
            message:'Subscription cancelled successfully',
            data:subscription
        })
    }
    catch(error){
        next(error)
    }
}