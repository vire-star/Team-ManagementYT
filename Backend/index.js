import express from 'express'
import { connectDb } from './src/Config/db.js'
import { ENV } from './src/Config/env.js'
import cookieParser from 'cookie-parser'
import userRoute from './src/routes/user.route.js'
import workshopRoute from './src/routes/workshop.route.js'
import taskRoute from './src/routes/task.route.js'
import commentRoute from './src/routes/comment.route.js'
import fileRoute from './src/routes/file.route.js'
import notificationRoute from './src/routes/notification.route.js'
import cors from 'cors'
import path from "path";


const app = express()

const __dirname = path.resolve()
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.get('/books',(req,res)=>{
    res.status(200).json({msg:"hello"})
})
// 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/api', userRoute)
app.use('/api/workshop', workshopRoute)
app.use('/api/task', taskRoute)
app.use('/api/comment', commentRoute)
app.use('/api/file', fileRoute)
app.use('/api/notification', notificationRoute)
app.use(express.static(path.join(__dirname,"../frontend/dist")))
app.get("/{*any}",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
})

app.listen(ENV.PORT,()=>{
    console.log(`server started on port ${ENV.PORT}`)
    connectDb()
})