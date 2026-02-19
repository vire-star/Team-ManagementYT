import express from 'express'
import { authMiddlware } from '../middleware/auth.middlware.js'
import { upload } from '../Config/imagekit.js'
import { createFile, getPrivateFile, getPublicFile } from '../controllers/file.controller.js'

const fileRoute= express.Router()


fileRoute.post('/createFile', authMiddlware, upload.single('url'), createFile)
fileRoute.get('/privateFile', authMiddlware, getPrivateFile)
fileRoute.get('/publiFile/:id', authMiddlware, getPublicFile)

export default fileRoute