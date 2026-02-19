import { createFileApi, getPrivateFileApi, getPublicFileApi } from "@/Api/file.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCreateFileHook = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:createFileApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            queryClient.invalidateQueries(['getPrivateFile','getPublicFile'])
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}

export const useGetPrivateFileHook=()=>{
    return useQuery({
        queryKey:['getPrivateFile'],
        queryFn:getPrivateFileApi
    })
}

export const useGetPublicFileHook=(id)=>{
    return useQuery({
        queryKey:['getPublicFile',id],
        queryFn:()=>getPublicFileApi(id)
    })
}