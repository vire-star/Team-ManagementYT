import express from 'express'
import { authMiddlware } from '../middleware/auth.middlware.js'
import { acceptInvitation, addMemberToWorkshop, createWorkshop, deleteWorkshop, getInvitedWorkshop, getMycreatedWorkshop, getSingleWorkshop, getTotalMemberInWorkshop, leaveWorkshop, removeUserFromWorkshop } from '../controllers/workshop.controller.js'

const workshopRoute = express.Router()


workshopRoute.post('/createWorkshop', authMiddlware, createWorkshop)
workshopRoute.get('/getMyCreatedWorkshop', authMiddlware, getMycreatedWorkshop)
workshopRoute.get('/getInvitedWorkshop', authMiddlware, getInvitedWorkshop)
workshopRoute.get('/getSingleWorkshop/:id', authMiddlware, getSingleWorkshop)
workshopRoute.post('/addMemberToWorkshop/:id', authMiddlware, addMemberToWorkshop)
workshopRoute.get('/acceptInvitation/:id', authMiddlware, acceptInvitation)
workshopRoute.get('/getTotalMemberInWorkshop/:id', authMiddlware, getTotalMemberInWorkshop)
workshopRoute.post('/leaveWorkshop/:id', authMiddlware, leaveWorkshop)
workshopRoute.post('/deleteWorkshop/:id', authMiddlware, deleteWorkshop)
workshopRoute.post('/removeUser/:id', authMiddlware, removeUserFromWorkshop)



export default workshopRoute