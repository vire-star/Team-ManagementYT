import axios from "axios"
import { baseUrl } from "./BaseUrl"

export const createFileApi = async(formdata)=>{
    const res = await axios.post(`${baseUrl}/file/createFile`,
        formdata,
        {
            withCredentials:true
        }
    )
    return res.data
}

export const getPrivateFileApi = async()=>{
    const res  = await axios.get(`${baseUrl}/file/privateFile`,
        {
            withCredentials:true
        }
    )

    return res.data
}


export const getPublicFileApi = async(id)=>{
    const res = await axios.get(`${baseUrl}/file/publiFile/${id}`,
        {
            withCredentials:true
        }
    )

    return res.data
}