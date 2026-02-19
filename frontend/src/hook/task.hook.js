import { assignTaskApi, changestatusApi, createTaskApi, deleteTaskApi, getAllTaskApi, getsingleTaskApi, getTaskAssignToUserApi } from '@/Api/task.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
export const useCreateTaskHook =()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:createTaskApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            queryClient.invalidateQueries(['getAllTask'])
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}


export const useGetAllTaskHook = (id)=>{
    return useQuery({
        queryFn:()=>getAllTaskApi(id),
        queryKey:['getAllTask',id]
    })
}

export const useGetSingleTaskHook=(id)=>{
    return useQuery({
        queryFn:()=>getsingleTaskApi(id),
        queryKey:['getSingleTask',id]
    })
}


export const useDeleteTaskHook=(id)=>{
    const queryClient = useQueryClient()
   return useMutation({
    mutationFn:deleteTaskApi,
    onSuccess:(data)=>{
        console.log(data)
        toast.success(data.message)
        queryClient.invalidateQueries(['getAllTask'])
    },
    onError:(err)=>{
        console.log(err)
         toast.error(err?.response?.data?.message)
    }
   })
}


export const useChangeStatusHook=()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:changestatusApi,
        onSuccess:(data)=>{
            console.log(data)
             queryClient.invalidateQueries(['getAllTask'])
             toast.success(data.message)
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}


export const useAssignTaskHook =()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:assignTaskApi,
        onSuccess:(data)=>{
            // console.log(data)
            queryClient.invalidateQueries(['getAllTask'])
            toast.success(data.message)
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}

export const useGetTaskAssignToUser=(id)=>{
    return useQuery({
        queryFn:()=>getTaskAssignToUserApi(id),
        queryKey:(['getTaskAssignToUser',id])
    })
}