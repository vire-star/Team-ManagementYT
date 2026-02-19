import { acceptInvitationApi, addMemberToWorkshopApi, createWorkshopApi, deleteWorkshopApi, getInvitedWorkshopApi, getMyCreatedWorkshopApi, getSingleWorkshopApi, getWorkshopMemberApi, leaveWorkshopApi, removeUserApi } from '@/Api/workshop.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
export const useCreateWorkshopHook=()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:createWorkshopApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            queryClient.invalidateQueries(['getMyCreatedWorkshop'])
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}


export const useGetMyCreatedWorkshopHook=()=>{
    return useQuery({
        queryKey:['getMyCreatedWorkshop'],
        queryFn:getMyCreatedWorkshopApi
    })
}

export const useGetInvitedWorkshopHook=()=>{
    return useQuery({
        queryKey:['getInvitedWorkshop'],
        queryFn:getInvitedWorkshopApi
    })
}

export const useGetSingleWorkshopHook=()=>{
    return useQuery({
        queryKey:['getSingleWorkshop'],
        queryFn:getSingleWorkshopApi
    })
}



export const useAddMemberToWorkshop=()=>{
    return useMutation({
        mutationFn:addMemberToWorkshopApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}


export const useAcceptInvitationHook = (id)=>{
    return useQuery({
        queryKey:['acceptInvitation'],
        queryFn:()=>acceptInvitationApi(id)
    })
}

export const useGetWorkshopMemberHook = (id)=>{
    return useQuery({
        queryKey:['getWorkshopMember',id],
        queryFn:()=>getWorkshopMemberApi(id)
    })
}


// export const useLeaveWorkshopMemberHook =(id)=>{
//     return useQuery({
//         queryKey:['leaveWorkshop',id],
//         queryFn:()=>leaveWorkshopApi(id)
//     })
// }


export const useLeaveWorkshopMemberHook=()=>{
    return useMutation({
        mutationFn:leaveWorkshopApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data?.message)
        },
        onError:(err)=>{
            console.log(err)
            toast.error(err?.response?.data?.message)
        }
    })
}

export const useDeleteWorkshopHook = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:deleteWorkshopApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            queryClient.invalidateQueries(['getMyCreatedWorkshop'])
        },
        onError:(err)=>{
            console.log(err)
            toast.error(err?.response?.data?.message)
        }
    })
}


export const useRemoveUserHook = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:removeUserApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            queryClient.invalidateQueries(['getMyCreatedWorkshop'])
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}