import axios from "axios"
import { baseUrl } from "./BaseUrl"
export const getAllNotificationApi = async()=>{
    const res = await  axios.get(`${baseUrl}/notification/getAllNotification`,
        {
            withCredentials:true
        }
    )
    return res.data
}

export const markNotificationReadApi = async(id)=>{
    const res = await axios.post(`${baseUrl}/notification/markAsRead/${id}`,
        {},
        {
            withCredentials:true
        }
    )

    return res.data
}

export const markAllNotificationAsRead=async()=>{
    const res = await axios.post(`${baseUrl}/notification/markAllNotification`,
        {},
        {
            withCredentials:true
        }

    )

    return res.data
}