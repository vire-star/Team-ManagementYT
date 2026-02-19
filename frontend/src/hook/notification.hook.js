import { getAllNotificationApi, markAllNotificationAsRead, markNotificationReadApi } from "@/Api/notification.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useMarkNotificationAsReadHook =()=>{
    const querClient = useQueryClient()
    return useMutation({
        mutationFn:markNotificationReadApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            querClient.invalidateQueries(['getNotification'])
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}


export const useMarkAllNotificationAsReadHook=()=>{
    const querClient = useQueryClient()
    return useMutation({
        mutationFn:markAllNotificationAsRead,
       onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            querClient.invalidateQueries(['getNotification'])
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}

export const useGetNotification = ()=>{
    return useQuery({
        queryKey:['getNotification'],
        queryFn:getAllNotificationApi
    })
}