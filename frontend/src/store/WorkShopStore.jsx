import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
export const useWorkshopStore  =create(
    devtools(
       persist(
        (set)=>({
        workshop:null,
        setWorkshop:(data)=>set({workshop:data}),
        clearWorkshop:()=>set({workshop:null})
        
       }),
       {
        name:"WorkshopStore"
       }
       )
    )
)