import { useGetUserHook } from "@/hook/user.hook"
import { useUserStore } from "@/store/UserStore"
import { useEffect } from "react"
import { Navigate } from "react-router-dom"

export const ProtectRoute=({children})=>{
    const setUser = useUserStore((state)=>state.setUser)
    const user = useUserStore((state)=>state.user)
    const {data, isLoading} = useGetUserHook()
    // console.log(data)
    

    useEffect(()=>{
        if(data){
            setUser(data)
        }
    })

    if(isLoading){
        return <div>Loading...</div>
    }

    if(!data){
        return <Navigate to={'/login'} replace/>
    }

    return children

}