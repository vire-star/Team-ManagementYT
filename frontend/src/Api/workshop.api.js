import axios from "axios"
import { baseUrl } from "./BaseUrl"

export const createWorkshopApi = async(payload)=>{
    const res = await axios.post(`${baseUrl}/workshop/createWorkshop`,
        payload,
        {
            withCredentials:true
        }
    )
    return res.data
}

export const getMyCreatedWorkshopApi = async()=>{
    const res = await axios.get(`${baseUrl}/workshop/getMyCreatedWorkshop`,
        {
            withCredentials:true
        }
    )
    return res.data
}


export const getInvitedWorkshopApi = async()=>{
    const res = await axios.get(`${baseUrl}/workshop/getInvitedWorkshop`,
        {
            withCredentials:true
        }
    )
    return res.data
}


export const getSingleWorkshopApi = async(id)=>{
    const res = await axios.get(`${baseUrl}/workshop/getSingleWorkshop/${id}`,
        {
            withCredentials:true
        }
    )
    return res.data
}

export const addMemberToWorkshopApi = async({id,payload})=>{
    const res = await axios.post(`${baseUrl}/workshop/addMemberToWorkshop/${id}`,
        payload,
        {
            withCredentials:true
        }
    )

    return res.data
}

export const acceptInvitationApi = async(id)=>{
    const res = await axios.get(`${baseUrl}/workshop/acceptInvitation/${id}`,
         {
            withCredentials:true
        }
    )
    return res.data
}

export const getWorkshopMemberApi =async(id)=>{
    const res = await axios.get(`${baseUrl}/workshop/getTotalMemberInWorkshop/${id}`, {
            withCredentials:true
        }
    )
    return res.data
}

export const leaveWorkshopApi = async(id)=>{
   const res = await axios.post(`${baseUrl}/workshop/leaveWorkshop/${id}`, 
    {},
    {
            withCredentials:true
        }
    )
    return res.data
}

export const deleteWorkshopApi = async(id)=>{
   const res = await axios.post(`${baseUrl}/workshop/deleteWorkshop/${id}`,
    {},
     {
            withCredentials:true
        }
    )
    return res.data
}

export const removeUserApi = async({deleteUserId,id})=>{
   const res = await axios.post(`${baseUrl}/workshop/removeUser/${id}`,
    {deleteUserId},
     {
            withCredentials:true
        }
    )
    return res.data
}