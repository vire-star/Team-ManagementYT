import { Task } from "../models/task.model.js";
import { Workshop } from "../models/workshop.model.js";
import { WorkshopMember } from "../models/workshopMember.model.js";

export const createtask = async(req, res)=>{
    try {
        const workshopId = req.params.id;

        const creatorId  = req.id;

        const {title, description} = req.body;

        if(!title || !description){
            return res.status(401).json({
                message:"please provide all the details"
            })
        }

        if(!workshopId){
            return res.status(401).json({
                message:"Please select workshop"
            })
        }

        const workshop = await Workshop.findById(workshopId)

        if(!workshop){
            return res.status(401).json({
                message:"Workshop not found"
            })
        }

        const task = await Task.create({
            title,
            description,
            workshopId,
            creatorId
        })

        return res.status(201).json({
            message:"Task created successfylly"
        })
    } catch (error) {
        console.log(error)
    }
}


export const getAllTask = async (req, res) => {
  try {
    const workshopId = req.params.id;

    if (!workshopId) {
      return res.status(400).json({
        message: "Workshop id is required"
      });
    }

    const task = await Task.find({ workshopId });

    return res.status(200).json(task);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


export const getSingleTask = async(req,res)=>{
    try {
        const userId = req.id;
        const taskId = req.params.id

        const task = await Task.findById(taskId).populate("assignees")

        if(!task){
            return res.status(401).json({
                message:"Task not found"
            })
        }

        const isCreator = task.creatorId.toString() === userId;
        const isAssigne = task.assignees.some((assignes)=>assignes._id.toString()===userId)


        if(!isCreator && !isAssigne){
            return res.status(401).json({
                message:"you are not assigned to that task"
            })
        }

        return res.status(201).json(task)
    } catch (error) {
        console.log(error)
    }
}



export const deleteTask = async(req,res)=>{
    try {
        const taskId = req.params.id;

        const task = await Task.findByIdAndDelete(taskId)

        if(!task){
            return res.status(401).json({
                message:"Task not found"
            })
        }

        return res.status(201).json({
            message:"Task deleted"
        })
    } catch (error) {
        console.log(error)
    }
}



export const changeStatus = async(req,res)=>{
    try {
        const taskId = req.params.id;
        const {status} = req.body;

        const creatorId = req.id
        

        const allowedStatus =['todo','in-progress','done']

        if(!allowedStatus.includes(status)){
            return res.status(401).json({
                message:"Invalid status"
            })
        }

        const task   = await Task.findByIdAndUpdate(taskId ,{
            status
        })

        if(!task){
            return res.status(401).json({
                message:"Task not found"
            })
        }

        return res.status(201).json({
            message:"Task status Updated"
        })
    } catch (error) {
        console.log(error)
    }
}


export const assignTaskToUser = async(req,res)=>{
    try {
        const taskId = req.params.id;
        const {userId} = req.body;
        const currentUserId  = req.id



        const task = await Task.findById(taskId)

        if(!task){
            return res.status(401).json({
                message:"Task not found"
            })
        }

        // check karenge ki user workshop mai hai ya nhi 

        const isMember= await WorkshopMember.findOne({
            workshopId:task.workshopId,
            userId:userId
           
        })

       
        

        // console.log(isMember.workshopId)
        


        if(!isMember){
            return res.status(401).json({
                message:"User is not a member in workshop"
            })
        }



        // already a member inside the task

        if(task.assignees.includes(userId)){
            task.assignees.pull(userId)
            await task.save()
            return res.status(201).json({
                message:"User removed from task"
            })
        }


        task.assignees.push(userId)
        await task.save()
        return res.status(201).json({
            message:"User assigned to task"
        })



    } catch (error) {
        console.log(error)
    }
}


export const getTaskAssignedToUser= async(req,res)=>{
    try {
        const userId = req.params.id;

        const task = await Task.find({
            assignees:userId
        }).populate("creatorId", "name email")


        return res.status(201).json(task)
    } catch (error) {
        console.log(error)
    }
}