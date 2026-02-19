import express from 'express'
import { authMiddlware } from '../middleware/auth.middlware.js'
import { createComment, getAllComment } from '../controllers/comment.controller.js'

const commentRoute = express.Router()


commentRoute.post('/createComment/:id', authMiddlware, createComment)
commentRoute.get('/getAllComment/:id', authMiddlware, getAllComment)

export default commentRoute