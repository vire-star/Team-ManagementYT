import axios from "axios"
import { baseUrl } from "./BaseUrl"

export const createCommentApi = async({text,id})=>{
    const res = await axios.post(`${baseUrl}/comment/createComment/${id}`,
        {text},
        {
            withCredentials:true
        }
    )
    return res.data
}

export const getAllCommentApi = async(id)=>{
    const res = await  axios.get(`${baseUrl}/comment/getAllComment/${id}`,
        {
            withCredentials:true
        }
    )

return res.data

}