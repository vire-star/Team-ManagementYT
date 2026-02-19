import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    reciepentId:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }, // yeh jiske paas notification jaayegi
    actorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },   // actorId woh hai jisme action kiya ,
    type:{
        type:String,
        enum:['WORKSHOP_MEMBER_ADDED','COMMENT_MENTION','WORKSHOP_LEFT', 'REMOVED FROM WORKSHOP','WORKSHOP_DELETED']

    },

    workshop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workshop"
    },
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        
    },
    message:{
        type:String,
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    }
}, {timestamps:true})

export const Notification  = mongoose.model("Notification", notificationSchema)

// let's say userA aur userB hain , 
// user A ne workhop leave kar diya toh jo notification hoga woh jaayega owner k paas jo hai userB 
// ab yaha par actor hai user A aur recepiten hai User B