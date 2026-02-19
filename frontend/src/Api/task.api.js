import axios from "axios"
import { baseUrl } from "./BaseUrl"

export const createTaskApi = async({title, description,id})=>{
    const res = await axios.post(`${baseUrl}/task/createTask/${id}`,
        {title, description},
        {
            withCredentials:true
        }
    )

    return res.data
}


export const getAllTaskApi = async(id)=>{
    const res = await axios.get(`${baseUrl}/task/getAllTask/${id}`,
        {
            withCredentials:true
        }
    )

    return res.data

}


export const getsingleTaskApi = async(id)=>{
    const res = await axios.get(`${baseUrl}/task/getsingleTask/${id}`,
        {
            withCredentials:true
        }
    )

    return res.data
}



export const deleteTaskApi = async(id)=>{
    const res = await axios.delete(`${baseUrl}/task/deleteTask/${id}`,
        {
            withCredentials:true
        }
    )

    return res.data
}

export const changestatusApi=async({status,id})=>{
    const res = await axios.put(`${baseUrl}/task/changestatus/${id}`,
        {status},
        {
            withCredentials:true
        }
    )

    return res.data

}


export const assignTaskApi = async({userId,id})=>{
    const res =await axios.post(`${baseUrl}/task/assignTask/${id}`,
        {userId},
        {
            withCredentials:true
        }
    )

    return res.data
}


export const getTaskAssignToUserApi = async(id)=>{
    const res = await axios.get(`${baseUrl}/task/getTaskAssignToUser/${id}`,
        {
            withCredentials:true
        }
    )

    return res.data
}