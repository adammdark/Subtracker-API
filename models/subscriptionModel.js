import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Subscription name is requierd'],
        trim:true,
        minLength:2,
        maxLength:100
    },
    price:{
        type:Number,
        required:[true,'Subscription price is required'],
        min:[0,'Price must be greater than 0'],
        max:[1000, 'Price must be less than 1000']
    },
    currency:{
        type:String,
        enum:['INR','USD','EUR','GBP'],
        default:'USD'
    },
    frequency:{
        type:String,
        enum:['daily','weekly','monthly','anually']
    },
    category:{
        type:String,
        enum:['Sports','Finance','Tech','Lifestyle','Entertainment','Education','Others'],
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        enum:['active','inactive','expired'],
        default:'active'
    },
    startDate:{
        type:Date,
        required:true,
        validate:{
            validator:function(value){
                return value <= new Date();
            },
            message:'Start date must be in past'
        }
    },
    renewalDate:{
        type:Date,
        validate:{
            validator:function(value){
                if (!value) return true;
                return value > this.startDate;
            },
            message:'Renewal date must be after the start date'
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,  
        index:true
    }

},{timestamps:true})

subscriptionSchema.pre('save',function(){

    if(!this.renewalDate){
        const renewalPeriods = {
            daily:1,
            weekly:7,
            monthly:30,
            anually:365
        }

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.startDate.getDate() + renewalPeriods[this.frequency])
    }

    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }

})

export default mongoose.model('Subscription',subscriptionSchema);