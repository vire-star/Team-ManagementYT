import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ENV } from "../Config/env.js";
import { imagekit } from "../Config/imagekit.js";
import { Invitation } from "../models/invitation.model.js";
import { WorkshopMember } from "../models/workshopMember.model.js";
import { Notification } from "../models/notification.model.js";
export const register = async(req ,res)=>{
    try {
        const {name, email, password, inviteToken} = req.body;

        if(!name || !email || !password){
            return res.status(401).json({
                message:"Please provide all the details"
            })
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(401).json({
                message:"User already exist "
            })
        }

        // normal password = 123456
        // lekin database hash format mai save hoga = asdlkdfuhalkgASF!#$%@%$

        const hashPassword = await bcrypt.hash(password , 10)

        const newUser = await User.create({
            name,
            email,
            password:hashPassword
        })

        const token= await jwt.sign({userId:newUser._id}, ENV.JWT_SECRET)
       let workshopId = null

if (inviteToken) {
  const invitation = await Invitation.findOne({
    token: inviteToken,
    email,
    status: 'pending',
    expiresAt: { $gt: new Date() }
  })

  if (invitation) {
    await WorkshopMember.create({
      workshopId: invitation.WorkshopId,
      userId: newUser._id,
      role: invitation.role,
      status: 'active'
    })

    invitation.status = 'accepted'
    await invitation.save()

    await Notification.create({
      reciepentId: newUser._id,
      actorId: invitation.invitedBy,
      type: 'WORKSHOP_MEMBER_ADDED',
      workshopId: invitation.WorkshopId,
      message: "You joined workshop"
    })

    workshopId = invitation.WorkshopId
  }
}




        return res.status(201).cookie("token",token,{
            maxAge:1*24*60*60*1000,
            httpOnly:true,
            secure:true,
            sameSite:"none"
        }).json({
            message:workshopId?`welcome  ${newUser.name} workshop joined successfully`:`welcome ${newUser.name}`
        })
    } catch (error) {
        console.log(`error from register , ${error}`)
    }
}


export const login = async(req ,res)=>{
    try {
        const{email, password} = req.body;

        if(!email|| !password){
            return res.status(401).json({
                message:"Please provide all the details"
            })
        }


        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                message:"Something went wrong"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Something went wrong"
            })

        }


        const token= await jwt.sign({userId:user._id}, ENV.JWT_SECRET)

        return res.status(201).cookie("token",token,{
            maxAge:1*24*60*60*1000,
            httpOnly:true,
            secure:true,
            sameSite:"none"
        }).json({
            message:`Welcom ${user.name}`,
            userId:user._id
        })

        
    } catch (error) {
        console.log(`error from login , ${error}`)
    }
}

export const logout = async(req, res)=>{
    try {
        return res.status(201).cookie("token","").json({
            message:"User logged out successfully"
        })
    } catch (error) {
        console.log(`error from logout, ${error}`)
    }
}


export const getUser =async(req,res)=>{
    try {
        const userId  = req.id

        const user = await User.findById(userId)

        if(!user){
            return res.status(401).json({
                message:"User not found please check"
            })
        }

        return res.status(201).json(user)
    } catch (error) {
        console.log(error)
    }
}



export const updateProfile  = async(req,res)=>{
    try {
        const userId = req.id

        const {name}=  req.body
        const uploadData= {}
        if(name){
            uploadData.name = name
        }

        if(req.file){
            const uploadResponse = await imagekit.upload({
                file:req.file.buffer,
                fileName:req.file.originalname,
                folder:'/user'
            })

            uploadData.avatarUrl = uploadResponse.url

        }


        const user = await User.findByIdAndUpdate(
            userId,
            uploadData,
            {new:true}
        )

        return res.status(201).json({
            message:"Profile updated"
        })
    } catch (error) {
        console.log(`error from updateProfile, ${error}`)
    }
}