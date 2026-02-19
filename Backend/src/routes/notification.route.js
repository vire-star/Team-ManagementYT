import express from 'express'
import { authMiddlware } from '../middleware/auth.middlware.js'
import { getNotification, markAllNotificationAsRead, markNotificationRead } from '../controllers/notification.controller.js'

const notificationRoute = express.Router()

notificationRoute.get('/getAllNotification', authMiddlware, getNotification)
notificationRoute.post('/markAsRead/:id', authMiddlware, markNotificationRead)
notificationRoute.post('/markAllNotification', authMiddlware, markAllNotificationAsRead)

export default notificationRoute