import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    
    },

    description:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:['todo','in-progress','done'],
        default:'todo'
    },
    creatorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    workshopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workshop"
    },

    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],


},{timestamps:true})


export const Task = mongoose.model("Task", taskSchema)