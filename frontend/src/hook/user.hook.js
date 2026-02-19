import { getUserApi, login, logout, register, updateProfileApi } from '@/Api/user.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const useRegisterHook = ()=>{
    const navigate =useNavigate()
    return useMutation({
        mutationFn:register,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message||"User Registed successfully")
            navigate('/home')
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}

export const useLoginHook = ()=>{
    const navigate   = useNavigate()
    return useMutation({
        mutationFn:login,
        onSuccess:(data)=>{
            console.log(data),
            toast.success(data.message)
            navigate('/home')
        },
        onError:(err)=>{
            console.log(err)
            toast.error(err.response.data.message)
        }
    })
}


export const useLogoutHook = ()=>{
    const navigate=  useNavigate()
    return useMutation({
        mutationFn:logout,
        onSuccess:(data)=>{
            console.log(data),
            toast.success(data.message)
            navigate('/login')
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}

export const useGetUserHook = ()=>{
    return useQuery({
        queryKey:['getUser'],
        queryFn:getUserApi,
        retry:false

    })
}


export const useUpdateUseHook = ()=>{
    const querClient=  useQueryClient()
    return useMutation({
        mutationFn:updateProfileApi,
        onSuccess:(data)=>{
            querClient.invalidateQueries(['getUser'])
            console.log(data),
            toast.success(data.message)
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }

    })
}