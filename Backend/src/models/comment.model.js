import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    workshopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workshop"
    },
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    },
    mentionUserId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
}, {timestamps:true})


export const Comment = mongoose.model("Comment", commentSchema)