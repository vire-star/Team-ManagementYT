import { createCommentApi, getAllCommentApi } from "@/Api/comment.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCreateCommentHook = ()=>{
    const querclient   = useQueryClient()
    return useMutation({
        mutationFn:createCommentApi,
        onSuccess:(data)=>{
            console.log(data)
            querclient.invalidateQueries(['getComment'])
            toast.success(data.message)

        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response?.data?.message)
        }
    })
}

export const useGetCommentHook=(id)=>{
 return useQuery({
    queryKey:['getComment',id],
    queryFn:()=>getAllCommentApi(id)

 })
}