import { Comment } from "../models/comment.model.js";
import { Notification } from "../models/notification.model.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { WorkshopMember } from "../models/workshopMember.model.js";


function extractMention(text) {
    if (!text || typeof text !== "string") return [];

    const regex = /@([a-zA-Z0-9_]+)/g;
    return [...text.matchAll(regex)].map(m => m[1]);
}
export const createComment =async(req ,res)=>{
    try {
        const {text} = req.body;
        const taskId = req.params.id;
        const authorId= req.id

      
        console.log(text)
          if (!text) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }
        const task = await Task.findById(taskId)

        
        if(!task){
            return res.status(401).json({
                message:"Task not foudn"
            })
        }

        // extract usernam from commnet

        // text mai value dega @ karke toh phir humara extract mention function start ho jaayega
// @virendra

        const mentionUserName = extractMention(text)


        let mentionUser =[]

        if(mentionUserName.length>0){
            // get karnna workshop members
            const workshopMembers= await WorkshopMember.find({
                workshopId:task.workshopId
            }).select("userId")


            const memberId = workshopMembers.map(m=>m.userId)

            mentionUser = await User.find({
                _id:{$in:memberId},
                name:{
                    $in:mentionUserName.map(name=> new RegExp(name, 'i'))
                }
            })
        }


        const comment = await Comment.create({
            workshopId:task.workshopId,
            taskId,
            authorId,
            text,
            mentionUserId:mentionUser.map(u=>u._id)
        })



        // create notification
        const notification = mentionUser
  .filter(u => !u._id.equals(authorId))
  .map(user => ({
    reciepentId: user._id,
    actor: authorId,
    type: 'COMMENT_MENTION',
    workshopId: task.workshopId,
    commentId: comment._id,
    message: text
  }));

console.log("Notifications to insert:", notification);

if (notification.length > 0) {
  await Notification.insertMany(notification);
}



        if(notification.length>0){
            await Notification.insertMany(notification)
        }

       
console.log("Notifications to insert:", notification)
        return res.status(200).json({
            message:"Comment added"
        })
    } catch (error) {
        console.log(error)
    }
}


export const getAllComment = async(req,res)=>{
    try {
        const taskId = req.params.id;

        const allComment = await Comment.find({
            taskId
        }).populate("authorId")

        if(!allComment){
            return res.status(401).json({
                message:"Please provide a valid task"
            })
        }

        return res.status(201).json(allComment)
    } catch (error) {
        console.log(error)
    }
}