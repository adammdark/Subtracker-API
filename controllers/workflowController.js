import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import dayjs from "dayjs";
import Subscription from "../models/subscriptionModel.js";
import { sendReminderEmail } from '../utils/sendEmail.js';

const REMIDERS = [7,5,2,1];

export const setReminders = serve(async(context)=>{

    const {subscriptionId} = context.requestPayload;

    const subscription = await fetchSubscription(context,subscriptionId);
    console.log(subscription); 

    if(!subscription || subscription.status !== 'active') return 

    const renewalDate = dayjs(subscription.renewalDate)

    if(renewalDate.isBefore(dayjs())){

        console.log(`Renewal dates has been passed for subscription ${subscriptionId}. stoping workflow.`);
        return;
    }

    for(const daysBefore of REMIDERS){

        const remiderDate = renewalDate.subtract(daysBefore,'day');

        if(renewalDate.isAfter(dayjs())){
            await sleepUntilReminder(context,`${daysBefore} days before reminder`,remiderDate);
        }

        if(dayjs().isSame(remiderDate,'day')){
            await triggerReminder(context,`${daysBefore} days before reminder`,subscription);
        }
    }

});

const fetchSubscription = async(context,subscriptionId)=>{

    return await context.run('get subscription',async()=>{
        return await Subscription.findById(subscriptionId).populate('user','name email');
    })
}

const sleepUntilReminder = async(context,label,date)=>{

    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label,date.toDate());
}

const triggerReminder = async(context,label,subscription)=>{

    return await context.run(label,async()=>{
        console.log(`Triggering ${label} reminder`);
        await sendReminderEmail({
            to:subscription.user.email,
            type:label,
            subscription
        })
    })
}

