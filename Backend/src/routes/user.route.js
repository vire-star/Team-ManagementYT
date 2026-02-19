import express from "express";
import { getUser, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import { authMiddlware } from "../middleware/auth.middlware.js";
import { upload } from "../Config/imagekit.js";

const userRoute = express.Router()


userRoute.post('/register', register)
userRoute.post('/login', login)
userRoute.post('/logout', logout)
userRoute.get('/getUser', authMiddlware, getUser)
userRoute.put('/updateProfile', authMiddlware, upload.single('avatarUrl'), updateProfile)

export default userRoute