import mongoose from "mongoose";
// import { Workshop } from "./workshop.model";

const invitationSchema = new mongoose.Schema({
    WorkshopId:{
         type:mongoose.Schema.Types.ObjectId,
                ref:"Workshop"
    },
    email:{
        type:String,
        required:true
    },
    role:{
        type:String,
       
    },
    invitedBy:{
        type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
    },
    token:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },

    status:{
        type:String,
        enum:['pending', 'accepted', 'expired'],
        default:'pending'
    }
},{timestamsp:true})


export const Invitation = mongoose.model("Invitation", invitationSchema)

// User A ne user B ko invite kiya 
// Toh invited by mai user A ki id jayegi

// token  hummey kyun provide karna hai aur token hai kya?

// toh dekho jab hum user ko invite karenge toh uski ek validation set karenge ki user 7 days k andar humarey workshop mai entry le le 
// aur woh ek token hum usko bhejenge  taki hum yeh verify kar sakey ji jo workshop mai entry le raha hai woh humara invited user he hai 
// hum nhi chahtey ki koi aur user humare workshop mai entry le toh for securtiy purpsose hum user ko ek token bhejege jiski help se woh humarey workshop mai entry lega