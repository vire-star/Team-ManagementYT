import { Notification } from "../models/notification.model.js";

export const markNotificationRead  = async(req ,res)=>{
    try {
        const notifictionId = req.params.id;
        const userId=req.id;

        console.log(notifictionId)
        if(!notifictionId){
            return res.status(401).json({
                message:"Please provide notification id "
            })
        }
        const notification = await Notification.findOneAndUpdate({
            _id:notifictionId,
            reciepentId:userId // yahan par sirf owner k notiifcationshow hongey
        },
    
    {
        isRead:true,
        readAt:new Date()
    },
    {new:true}
    )


    if(!notification){
        return res.status(401).json({
            message:"Notication not found or not yours"
        })
    }

    return res.status(201).json({
        message:"notification marked as read"
    })

    } catch (error) {
        console.log(error)
    }
}

export const markAllNotificationAsRead= async(req,res)=>{
    try {
        const userId = req.id

        const result= await Notification.updateMany({
            reciepentId:userId,
            isRead:false
        },{
            isRead:true,
            readAt:new Date()
        })

        return res.status(201).json({
            message:"All notification marked as read"
        })
    } catch (error) {
        console.log(error)
    }
}


export const getNotification = async(req, res)=>{
    try {
        const userId = req.id;

        const { showed ='false'} =req.query

        const filter = {
            reciepentId:userId,
            isRead:showed==='true' ?undefined:false
        }


        const notification = await Notification.find(filter)

        return res.status(201).json(notification)
    } catch (error) {
        console.log(error)
    }
}