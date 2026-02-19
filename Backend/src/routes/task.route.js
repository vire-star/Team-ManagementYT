import express from 'express'
import { authMiddlware } from '../middleware/auth.middlware.js'
import { isTaskOwner, isWorkshopOwner } from '../middleware/task.middleware.js'
import { assignTaskToUser, changeStatus, createtask, deleteTask, getAllTask, getSingleTask, getTaskAssignedToUser } from '../controllers/task.controller.js'


const taskRoute = express.Router()


taskRoute.post('/createTask/:id', authMiddlware, isWorkshopOwner, createtask)
taskRoute.get('/getAllTask/:id', authMiddlware, getAllTask)
taskRoute.get('/getsingleTask/:id', authMiddlware, getSingleTask)
taskRoute.delete('/deleteTask/:id', authMiddlware, isTaskOwner, deleteTask)
taskRoute.put('/changestatus/:id', authMiddlware, isTaskOwner, changeStatus)
taskRoute.post('/assignTask/:id', authMiddlware, isTaskOwner, assignTaskToUser)
taskRoute.get('/getTaskAssignToUser/:id', authMiddlware,  getTaskAssignedToUser)

export default taskRoute