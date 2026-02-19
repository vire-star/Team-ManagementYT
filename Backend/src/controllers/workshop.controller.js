import { transporter } from "../Config/email.js"
import { ENV } from "../Config/env.js"
import { Invitation } from "../models/invitation.model.js"
import { User } from "../models/user.model.js"
import { Workshop } from "../models/workshop.model.js"
import { WorkshopMember } from "../models/workshopMember.model.js"
import { Notification } from "../models/notification.model.js"
import crypto from 'crypto'
import { Task } from "../models/task.model.js"
export const createWorkshop = async(req ,res)=>{
    try {
        const { name, description} = req.body

        const userId= req.id
        if(!name || !description){
            return res.status(401).json({
                message:"Please provide all the detals"
            })
        }

        if(!userId){
            return res.status(401).json({
                message:"User id not found"
            })
        }

        const  user = await User.findById(userId)

        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }


        const workshop  = await Workshop.create({
            name, 
            description,
            ownerId:userId
        })


        return res.status(201).json({
            message:"Workshop created successfully"
        })

    } catch (error) {
        console.log(`error from create workshop, ${error}`)
    }
}



export const getMycreatedWorkshop=async(req,res)=>{
    try {
        const userId = req.id

        const workshop = await Workshop.find({ownerId:userId})
        .sort({createdAt:-1})
        .lean()

        if(!workshop){
            return res.status(401).json({
                message:"Workshop not found"
            })
        }

        return res.status(201).json(workshop)
    } catch (error) {
        console.log(`error from get my created workshop, ${error}`)
    }
}


export const getInvitedWorkshop = async(req,res)=>{
    try {
        const userId = req.id
        // find all the workshop where user is member

        const membership = await WorkshopMember.find({userId})
        .populate({
            path:'workshopId',
            populate:{
                path:'ownerId',
                select:'name email avatarUrl'
            }
        })


        if(!membership){
            return res.status(401).json({
                message:"Currently you are not invited"
            })
        }
        // filter out workshop where user is owner

        

        return res.status(201).json(membership)
    } catch (error) {
        console.log(`error from get invited workshop, ${error}`)
    }
}


export const getSingleWorkshop = async(req,res)=>{
    try {
        const workshopId  = req.params.id

        if(!workshopId){
            return res.status(401).json({
                message:"Please provide workshop id"
            })
        }


        const singleWorkshop = await Workshop.findById(workshopId)

        if(!singleWorkshop){
            return res.status(401).json({
                message:"No workshop found"
            })
        }

        return res.status(201).json(singleWorkshop)
    } catch (error) {
        console.log(`error from get single workshop, ${error}`)
    }
}


export const addMemberToWorkshop = async(req,res)=>{
    try {
        const{email, role}= req.body;
        const workshopId = req.params.id
        const currentUserId  =req.id

        const user = await User.findById(currentUserId)

        if(!user){
            return res.status(401).json({
                message:"user not found"
            })
        }

        const workshop = await Workshop.findById(workshopId)

        if(!workshop){
            return res.status(401).json({
                message:"Worksohop not found"
            })
        }


        const isOwner = workshop.ownerId.toString()===currentUserId

        if(!isOwner){
            return res.status(401).json({
                message:"Only owner can send the inviation"
            })
        }


        // maan lijiye jis user ko hum inivte bhej rhay hain 
        // toh whan do problem aati hai 
        // 1> ki user k account already exxsit karta hai toh uske liye aap seedha use rko login karwa kar workshop mai entry de do 
        // 2. agar user ka account nhi hai toh aap pehle user ka accoiutn creat karo and then usko permision do to access workshop

        const userExist = await User.findOne({email})
        if(userExist){
            const alreadyAMembr = await WorkshopMember.findOne({
                workshopId,
                userId:userExist._id
            })

            if(alreadyAMembr){
                return res.status(401).json({
                    message:"user is already a member of this workshop"
                })
            }
        }


        const existingInvitation   = await Invitation.findOne({
            WorkshopId:workshopId,
            email,
            invitedBy:currentUserId,
            status:"pending",
            expiresAt:{$gt:new Date()}

        })


        if(existingInvitation){
            return res.status(401).json({
                message:"Invitation already sent to this user",
                invitationId:existingInvitation._id
            })
        }


        const token = crypto.randomBytes(32).toString("hex")
        const expiresAt=new Date(Date.now()+7*24*60*60*1000) // thisi is for 7 days
        const invitation   = await Invitation.create({
            WorkshopId:workshopId,
            email, 
            role,
            token,
            expiresAt,
            invitedBy:currentUserId
        })


        const inviterUser = await User.findById(currentUserId)


        if(userExist){
            const acceptLink = `${ENV.CLIENT_URL}/accept-invite/${token}`
            await transporter.sendMail({
                from:ENV.USER_MAIL,
                to:email,
                subject:`Invitation to join ${workshop.name}`,
                html:`
                  <h2>Workshop Invitation</h2>
          <p>Hi,</p>
          <p><strong>${inviterUser.name}</strong> invited you to join <strong>${workshop.name}</strong> as a ${role}.</p>
          <a href="${acceptLink}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Accept Invitation</a>
          <p>Or copy: ${acceptLink}</p>
          <p>Expires in 7 days.</p>



                `
            })
        } else {
            const registerLink = `${ENV.CLIENT_URL}/register?invite=${token}`   
            await transporter.sendMail({
                from:ENV.USER_MAIL,
                to:email,
                subject:`You're  invited to ${workshop.name}`,
                html:`
                <h2>Workshop Invitation</h2>
          <p>Hi,</p>
          <p><strong>${inviterUser.name}</strong> invited you to <strong>${workshop.name}</strong>.</p>
          <p>Create account to join:</p>
          <a href="${registerLink}" style="display:inline-block;padding:10px 20px;background:#28a745;color:#fff;text-decoration:none;border-radius:5px;">Create Account & Join</a>
          <p>Or copy: ${registerLink}</p>
          <p>Expires in 7 days.</p>


                `
            })


            
        }


          return res.status(201).json({
            message:"Invitation send successfully"
        })

      

    } catch (error) {
        console.log(`error from add member to workshop ${error}`)
    }
}


export const acceptInvitation = async(req,res)=>{
    try {
        const token = req.params.id
        const userId   = req.id
        console.log(userId)
        

        const invitation = await Invitation.findOne({
            token, 
            status:'pending',
            expiresAt:{$gt:new Date()}
        })

        if(!invitation){
            return res.status(401).json({
                message:"Invalid or expired invitation"
            })
        }

        const user = await User.findById(userId)

        // koi user hai user A 
        // koi other user like userB userA k mail check na karey toh isliye yaha validation use kiya hai 
        if(user.email !== invitation.email){
            return res.status(403).json({
                message:"This invitation was sent to someone else"
            })
        }


        const existingUser = await WorkshopMember.findOne({
            workshopId:invitation.WorkshopId,
            userId
        })

        if(existingUser){
            return res.status(401).json({
                message:"User already in workshop"
            })
        }


        await WorkshopMember.create({
            workshopId:invitation.WorkshopId,
            userId,
            role:invitation.role
           
        })

        // mark invitation as accepted
        invitation.status='accepted',
        await invitation.save()

        
        const workshopName = await Workshop.findById(invitation.WorkshopId)

        if(!workshopName){
            return res.status(401).json({
                message:"Workshop not found"
            })
        }
        await Notification.create({
            
            reciepentId:userId,
            actorId:invitation.invitedBy,
            type:"WORKSHOP_MEMBER_ADDED",
             workshop:invitation.WorkshopId,
             message:`You joined ${workshopName.name}`
            
        })


        return res.status(201).json({
            message:"Successfuly joined workshop"
        })
    } catch (error) {
        console.log(`error from accept invitaion ,${error}`)
    }
}


export const getTotalMemberInWorkshop  =async(req,res)=>{
    try {
        const workshopId = req.params.id
        console.log(workshopId)
        const userId = req.id
        
        const allMembers = await WorkshopMember.find({workshopId}).populate("userId","name")

        if(!allMembers){
            return res.status(401).json({
                message:"workshop not found"
            })
        }

        return res.status(201).json(allMembers)
    } catch (error) {
        console.log(error)
    }
}



export const leaveWorkshop = async(req, res)=>{
    try {
        const workshopId = req.params.id;
        const userId   = req.id;

        const user = await User.findById(userId)

        const workshop = await Workshop.findById(workshopId)
        

        if(!workshop){
            return res.status(401).json({
                message:"Workshop not found"
            })
        }
        // owner cannot  leave workshop

        if(workshop.ownerId.toString() === userId){
            return res.status(401).json({
                message:"Owner cannnot leave workshjop"
            })
        }

        const members = await WorkshopMember.findOne({
            workshopId,
            userId
        })


        if(!members){
            return res.status(401).json({
                message:"You are not a part of this workshop"
            })
        }


        // Remove user from assigned task


        await Task.updateMany(
            {workshopId},
            {$pull:{assignees:userId}}
        )

        await Task.deleteMany({
            workshopId,
            creatorId:userId
        })

        await WorkshopMember.deleteOne({workshopId, userId})

        await Notification.create({
            reciepentId:workshop.ownerId,
            actorId:userId,
            type:"WORKSHOP_LEFT",
            message:`${user.name} left the workshop`
        })


        return res.status(201).json({
            message:"You leaved workshop"
        })
    } catch (error) {
        console.log(error)
    }
}


export const deleteWorkshop = async(req,res)=>{
    try {
        const workshopId = req.params.id;
        const userId = req.id

        const user = await User.findById(userId)

        const workshop = await Workshop.findById(workshopId)

        if(!workshop){
            return res.status(401).json({
                message:"workshop not found"
            })
        }

        if(workshop.ownerId.toString() !== userId){
            return res.status(401).json({
                message:"Only owner can delete workshop"
            })
        }

        // find all members

        const members   = await WorkshopMember.find({workshopId})

        // notification
        const notification = members.map((m)=>({
            reciepentId:m.userId,
            actorId:userId,
            type:'WORKSHOP_DELETED',
            workshopId,
            message:`workshop ${workshop.name} has been deleted`
        }))

        if(notification.length){
            await Notification.insertMany(notification)
        }


        // delete all realated data

        await Promise.all([
            Task.deleteMany({workshopId}),
            WorkshopMember.deleteMany({workshopId}),
            Invitation.deleteMany({workshopId}),
            Notification.deleteMany({workshopId})
        ])

        await Workshop.findByIdAndDelete(workshopId);
        return res.status(401).json({
            message:"Workshop deleted successfully"
        })

    } catch (error) {
        console.log(error)
    }
}

export const removeUserFromWorkshop = async (req, res) => {
  try {
    const workshopId = req.params.id
    const ownerId = req.id
    const { deleteUserId } = req.body

    if (!deleteUserId) {
      return res.status(400).json({ message: "Please select user" })
    }

    const workshop = await Workshop.findById(workshopId)
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" })
    }

    if (workshop.ownerId.toString() !== ownerId.toString()) {
      return res.status(403).json({ message: "Only owner can remove user" })
    }

    if (deleteUserId.toString() === ownerId.toString()) {
      return res.status(400).json({ message: "Owner cannot remove himself" })
    }

    const member = await WorkshopMember.findOne({
      workshopId,
      userId: deleteUserId
    })

    if (!member) {
      return res.status(404).json({ message: "User not in the workshop" })
    }

    await Task.updateMany(
      { workshopId },
      { $pull: { assignees: deleteUserId } }
    )

    await WorkshopMember.deleteOne({
      workshopId,
      userId: deleteUserId
    })

    await Notification.create({
      reciepentId: deleteUserId,
      actorId: ownerId,
      type: "REMOVED FROM WORKSHOP",
      workshop: workshopId,
      message: `You have been removed from ${workshop.name} workshop`
    })

    return res.status(200).json({
      message: "User has been removed"
    })

  } catch (error) {
    console.log(error)
  }
}
