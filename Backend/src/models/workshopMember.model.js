import mongoose from "mongoose";

const workshopMemberSchema= new mongoose.Schema({
    workshopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workshop",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    role:{
        type:String,
        role:"member",
        required:true
    }

},{timestamps:true})


export const WorkshopMember = mongoose.model("WorkshopMember", workshopMemberSchema)