import { useUserStore } from '@/store/UserStore'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useForm } from 'react-hook-form'
import { useUpdateUseHook } from '@/hook/user.hook'
import { useAddMemberToWorkshop, useCreateWorkshopHook, useDeleteWorkshopHook, useGetInvitedWorkshopHook, useGetMyCreatedWorkshopHook, useGetWorkshopMemberHook, useRemoveUserHook } from '@/hook/workshop.hook'
import { useAssignTaskHook, useGetAllTaskHook, useGetSingleTaskHook } from '@/hook/task.hook'


const Settings = () => {
    const {register, handleSubmit} = useForm()
    const {register: registerWorkshop, handleSubmit: handleSubmitWorkshop, reset: resetWorkshopForm} = useForm()
    const {register: registerInvite, handleSubmit: handleSubmitInvite, reset: resetInviteForm} = useForm()
    const user = useUserStore((state)=>state.user)
    const [Selectedworkshop, setSelectedworkshop] = useState()
    const [workshopId, setworkshopId] = useState(null)
    const [dialogOpen, setdialogOpen] = useState(false)
    const [createWorkshopDialogOpen, setCreateWorkshopDialogOpen] = useState(false)
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
    const [RemoveUserPendingState, setRemoveUserPendingState] = useState(null)

    const [taskPopover, settaskPopover] = useState(false)
    const {data} = useGetMyCreatedWorkshopHook()
    // console.log(data)
    const {data:invitedWorkshop} = useGetInvitedWorkshopHook()
    // console.log(invitedWorkshop)

    const invitedWorkshopLength = invitedWorkshop?.length 
    // console.log(invitedWorkshopLength)

    const {mutate}  = useUpdateUseHook()
    const {mutate:mutateWorkshop, isPending} = useCreateWorkshopHook()
    const updateProfileHandler=(data)=>{
        console.log(data)

        const formdata = new FormData()

        if(data.name){
            formdata.append('name', data.name)
        }

        if(data.avatarUrl && data.avatarUrl[0]){
            formdata.append('avatarUrl', data.avatarUrl[0])
        }

        mutate(formdata)

    }

     const createWorkshopHandler=(data)=>{
      mutateWorkshop(data,
        {
          onSuccess:()=>{
            setCreateWorkshopDialogOpen(false)
            resetWorkshopForm()
          }
        }
      )
    }

    const {mutate:mutateInvite, isPending:isInvitePending} = useAddMemberToWorkshop()
    const inviteMemberHandler=(data)=>{
      const payload ={
        email:data.email,
        role:"member",
        // id:Selectedworkshop.id
      }
      mutateInvite({payload,id:Selectedworkshop._id},
        {
          onSuccess:()=>{
            setInviteDialogOpen(false)
          }
        }
      )
     
    }

    const {data:WorkshopMember} = useGetWorkshopMemberHook(Selectedworkshop?._id)
    // console.log(WorkshopMember)
    const {mutate: deleteWorkshopHook, isPending:deleteWorkshopPending}=useDeleteWorkshopHook()
    const deleteWorkshop=(data)=>{
      deleteWorkshopHook(data._id)
    }

    const {mutate:removerUserFromWorkshop,isPending:removeUserPending}=useRemoveUserHook()
    const removeUser=(data)=>{
      
      
      const userData={
        id:data?.workshopId,
        deleteUserId:data?.userId?._id

      }
      setRemoveUserPendingState(data?.userId?._id)
      removerUserFromWorkshop(userData,
        {
          onSuccess:()=>{
            setRemoveUserPendingState(null)
          }
        }
      )
     

    }

    const {data:getAllTask} = useGetAllTaskHook(Selectedworkshop?._id)

    console.log(getAllTask)
    const {mutate:assignTaskToUser, isPending:assignTaskPending} = useAssignTaskHook()
    const [taskPendingState, settaskPendingState] = useState(null)

    const assignTaskHandler = (data)=>{
      settaskPendingState(data.id)
      assignTaskToUser(data,
        {
          onSuccess:()=>{
            settaskPendingState(null)
          }
        }
      )
    }

    
  return (
    <div className='h-screen w-full overflow-y-auto'> 
        {/* ================= PROFILE HEADER ================= */}
    <div className="bg-white border-b border-slate-200 px-10 py-8 flex items-center gap-6">

      <div className="relative h-24 w-24">
        <img
          src={user?.avatarUrl}
          className="h-full w-full rounded-full object-cover border border-slate-200"
        />
        <button
          onClick={() => setdialogOpen(true)}
          className="absolute bottom-0 right-0 bg-white border border-slate-300 
                     p-1 rounded-full shadow-sm hover:bg-slate-100 transition"
        >
          <Pencil size={14} />
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          {user?.name}
        </h2>
        <p className="text-sm text-slate-500">Account Settings</p>
      </div>

    </div>

    {/* ================= MAIN CONTENT ================= */}
    <div className="max-w-6xl mx-auto px-10 py-10 space-y-10">

      {/* ===== WORKSHOP SECTION ===== */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">
            Your Workshops
          </h3>

          <button
            onClick={() => setCreateWorkshopDialogOpen(true)}
            className="px-4 py-2 text-sm bg-slate-900 text-white 
                       rounded-md hover:bg-slate-800 transition"
          >
            New Workshop
          </button>
        </div>

        <Accordion
          type="single"
          collapsible
          value={workshopId}
          onValueChange={(value) => {
            setworkshopId(value)
            const selected = data?.find((w) => w._id === value)
            setSelectedworkshop(selected)
          }}
        >
          {data?.map((item) => (
            <AccordionItem key={item._id} value={item._id}>

              <AccordionTrigger className="text-sm font-medium text-slate-700">
                {item.name}
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-4 pt-4">

                  {/* MEMBERS */}
                  <div className="space-y-3">
                    {WorkshopMember?.map((member) => (
                      <div
                        key={member.userId._id}
                        className="flex items-center justify-between 
                                   border border-slate-200 
                                   rounded-md px-4 py-3 bg-slate-50"
                      >

                        <span className="text-sm text-slate-700">
                          {member.userId.name}
                        </span>

                        <div className="flex items-center gap-3">

                          {/* TASK POPOVER */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="text-xs px-3 py-1.5 
                                                 border border-slate-300 
                                                 rounded-md hover:bg-slate-100">
                                Manage Tasks
                              </button>
                            </PopoverTrigger>

                            <PopoverContent className="w-72">
                              <div className="space-y-3">

                                {getAllTask?.length > 0 ? (
                                  getAllTask.map((task) => {
                                    const taskAssigneTrue =
                                      task.assignees.includes(member?.userId?._id)

                                    return (
                                      <div
                                        key={task._id}
                                        className="flex items-center justify-between"
                                      >
                                        <span className="text-xs text-slate-600">
                                          {task.title}
                                        </span>

                                        <button
                                          onClick={() =>
                                            assignTaskHandler({
                                              id: task._id,
                                              userId: member?.userId?._id,
                                            })
                                          }
                                          className="text-xs px-2 py-1 
                                                     bg-slate-800 text-white 
                                                     rounded-md"
                                        >
                                          {taskPendingState === task._id
                                            ? "Updating..."
                                            : taskAssigneTrue
                                            ? "Remove"
                                            : "Assign"}
                                        </button>
                                      </div>
                                    )
                                  })
                                ) : (
                                  <p className="text-xs text-slate-500">
                                    No tasks found
                                  </p>
                                )}

                              </div>
                            </PopoverContent>
                          </Popover>

                          <button
                            onClick={() => removeUser(member)}
                            className="text-xs px-3 py-1.5 
                                       border border-red-300 
                                       text-red-600 
                                       rounded-md hover:bg-red-50"
                          >
                            {RemoveUserPendingState === member?.userId?._id
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-between pt-4">

                    <button
                      onClick={() => deleteWorkshop(item)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      {deleteWorkshopPending
                        ? "Deleting..."
                        : "Delete Workshop"}
                    </button>

                    <button
                      onClick={() => setInviteDialogOpen(true)}
                      className="text-sm px-4 py-2 
                                 bg-slate-900 text-white 
                                 rounded-md hover:bg-slate-800"
                    >
                      Add Member
                    </button>

                  </div>

                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>

      {/* ===== INVITED WORKSHOPS ===== */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Invited Workshops
        </h3>

        {invitedWorkshop?.length > 0 ? (
          <ul className="space-y-2">
            {invitedWorkshop.map((w) => (
              <li
                key={w._id}
                className="border border-slate-200 rounded-md px-4 py-2 bg-slate-50 text-sm"
              >
                {w.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">
            No invited workshops
          </p>
        )}
      </div>

    </div>



<Dialog open={dialogOpen} onOpenChange={setdialogOpen}>
 
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Update profile here...</DialogTitle>
      
        <form onSubmit={handleSubmit(updateProfileHandler)} className='flex flex-col ' action="">
            <input type="text" {...register('name')} />
            <input type="file" {...register('avatarUrl')} />

            <button type='submit' className='p-2 rounded-md bg-slate-700 text-zinc-50'>submit</button>
        </form>
     
    </DialogHeader>
  </DialogContent>
</Dialog>



<Dialog open={createWorkshopDialogOpen} onOpenChange={setCreateWorkshopDialogOpen}>
 
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Workshop</DialogTitle>
      
        <form onSubmit={handleSubmitWorkshop(createWorkshopHandler)} className='flex flex-col ' action="">
            <input type="text" placeholder='Enter Workshop title' {...registerWorkshop('name')} />
            <input type="text" placeholder='Enter Workshop Description' {...registerWorkshop('description')} />

            <button type='submit' className='p-2 rounded-md bg-slate-700 text-zinc-50'>
              {isPending ? 'Creating...' : 'Create Workshop'}
              </button>
        </form>
     
    </DialogHeader>
  </DialogContent>
</Dialog>


<Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
 
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Invite Member</DialogTitle>
      
        <form onSubmit={handleSubmitInvite(inviteMemberHandler)} className='flex flex-col ' action="">
            <input type="email" {...registerInvite('email')} placeholder='Enter Email'/>
           

            <button type='submit' className='p-2 rounded-md bg-slate-700 text-zinc-50'>
              {isInvitePending ? 'Inviting...' : 'Invite Member'}
            </button>
        </form>
     
    </DialogHeader>
  </DialogContent>
</Dialog>





    </div>
  )
}

export default Settings