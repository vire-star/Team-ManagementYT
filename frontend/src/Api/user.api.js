import axios from "axios"
import { baseUrl } from "./BaseUrl"

export const register = async(payload)=>{
    const res = await axios.post(`${baseUrl}/register`,
        payload,
        {
            headers:{'Content-Type':'application/json'},
            withCredentials:true
        }
    )

    return res.data

}

export const login = async(payload)=>{
    const res = await axios.post(`${baseUrl}/login`,
        payload,
        {
            headers:{'Content-Type':'application/json'},
            withCredentials:true
        }
    )

    return res.data

}


export const logout = async()=>{
    const res = await axios.post(`${baseUrl}/logout`,
        {},
        {
            headers:{'Content-Type':'application/json'},
            withCredentials:true
        }
    )

    return res.data

}

export const getUserApi = async()=>{
    const res = await axios.get(`${baseUrl}/getUser`
        ,
        {
            headers:{'Content-Type':'application/json'},
            withCredentials:true
        }
    )

    return res.data

}

export const updateProfileApi = async(payload)=>{
    const res = await axios.put(`${baseUrl}/updateProfile`,
        payload,
        {
            withCredentials:true,
            headers:{'Content-Type':'multipart/form-data'}
        }
    )

    return res.data
}