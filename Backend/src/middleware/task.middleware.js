import { Task } from "../models/task.model.js";
import { Workshop } from "../models/workshop.model.js";



export const isWorkshopOwner = async(req, res, next)=>{
    try {
        const userId = req.id;
        const workshopId = req.params.id

        if(!workshopId){
            return res.status(401).json({
                message:"Please provide workshop id"
            })
        }

        const workshop = await Workshop.findById(workshopId)

        if(!workshop){
            return res.status(401).json({
                message:"Workshop not found"
            })
        }

        if(workshop.ownerId.toString() !== userId){
            return res.status(401).json({
                message:"ONly wokrshop owner perform this task"
            })
        }

        next()
    } catch (error) {
        console.log(error)
    }
}


export const isTaskOwner = async(req, res, next)=>{
    try {
        const userId =req.id
        const taskId = req.params.id

        if(!taskId){
            return res.status(401).json({
                message:"Task id not found"
            })
        }


        const task = await Task.findById(taskId)

        if(!task){
            return res.status(401).json({
                message:"Task not found"
            })
        }


        const workshop = await Workshop.findById(task.workshopId)

        if(!workshop){
            return res.status(401).json({
                message:"Worksnop not found"
            })
        }

        if(workshop.ownerId.toString() !== userId){
            return res.status(401).json({
                message:"Only workshop owner perform this task"
            })
        }


        next()
    } catch (error) {
        console.log(error)
    }
}