import { imagekit } from "../Config/imagekit.js";
import { File } from "../models/file.model.js";
import { Task } from "../models/task.model.js";
import { Workshop } from "../models/workshop.model.js";

export const createFile = async(req ,res)=>{
    try {
        const userId = req.id;

        const {visibility, workshopId, taskId} = req.body

        if(!req.file){
            return res.status(401).json({
                message:"Please select file"
            })
        }


        if(!['private', 'workshop'].includes(visibility)){
            return res.status(401).json({
                message:"Invalid visibility type"
            })
        }

        const task = await Task.findOne({
            _id:taskId,
            workshopId:workshopId
        })


        const workshop = await Workshop.findById(workshopId)

       if(visibility==='workshop'){
         if(!task || !workshop){
            return res.status(401).json({
                message:"Invalid workshop or task"
            })
        }
       }

        const uploadRes= await imagekit.upload({
            file:req.file.buffer,
            fileName:req.file.originalname,
            folder:
            visibility==='private'
            ? `/user/${userId}`
            : `/workshop/${workshopId}`
        })

        const fileDoc = await File.create({
            name:req.file.originalname,
            url:uploadRes.url,
            visibility,
            ownerId:userId,
            workshopId:visibility ==='workshop'? workshopId:null,
            taskId:visibility ==='workshop'?taskId:null
        })

        return res.status(201).json({
            message:"File uploaded"
        })
    } catch (error) {
        console.log(error)
    }
}


export const getPrivateFile = async(req,res)=>{
    try {
        const userId = req.id;
        const file = await File.find({
            ownerId:userId,
            visibility:"private"
        })

        if(!file){
            return res.status(401).json({
                message:"File not found"
            })
        }

        return res.status(201).json(file)
    } catch (error) {
        console.log(error)
    }
}


export const getPublicFile =async(req,res)=>{
    try {
        const userId = req.id

        const taskId = req.params.id

        const file = await File.find({
            taskId
        })

        if(!file){
            return res.status(201).json({
                message:"invalid task id"
            })
        }

        return res.status(201).json(file)
    } catch (error) {
        console.log(error)
    }
}