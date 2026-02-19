import { useLogoutHook } from '@/hook/user.hook'
import { useUserStore } from '@/store/UserStore'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useGetInvitedWorkshopHook,
  useGetMyCreatedWorkshopHook
} from '@/hook/workshop.hook'
import { useWorkshopStore } from '@/store/WorkShopStore'
import {
  useGetNotification,
  useMarkAllNotificationAsReadHook,
  useMarkNotificationAsReadHook
} from '@/hook/notification.hook'
import {
  LogOut,
  Bell,
  Settings,
  Folder,
  LayoutGrid
} from "lucide-react"

const SideBar = () => {

  const user = useUserStore((state) => state.user)
  const setWorkshop = useWorkshopStore((state) => state.setWorkshop)
  const clearWorkshop = useWorkshopStore((state) => state.clearWorkshop)

  const { data: createdWorkshops } = useGetMyCreatedWorkshopHook()
  console.log(createdWorkshops)
  const { data: invitedWorkshops } = useGetInvitedWorkshopHook()
  const { data: getAllNotification } = useGetNotification()

  const { mutate: logoutMutate } = useLogoutHook()
  const { mutate: markNotificationRead } = useMarkNotificationAsReadHook()
  const { mutate: markAllNotificationRead } = useMarkAllNotificationAsReadHook()

  const [dialogNotification, setDialogNotification] = useState(false)

  const notificationLength = getAllNotification?.length || 0
  const invitedWorkshopLength = invitedWorkshops?.length || 0

  const logoutHandler = () =>{

    logoutMutate({},{
      onSuccess:()=>{
        clearWorkshop()
      }
    })
  } 
    

  const SingleWorkshopStore = (data) => {
    setWorkshop(data)
  }

  return (
    <div className="h-screen w-[270px] bg-zinc-950 text-zinc-200 flex flex-col justify-between px-6 py-6 border-r border-zinc-800">

      {/* ================= TOP SECTION ================= */}
      <div className="flex flex-col gap-8">

        {/* USER INFO */}
        <div>
          <p className="text-xs text-zinc-500">Logged in as</p>
          <h2 className="text-sm font-semibold mt-1 text-white truncate">
            {user?.name}
          </h2>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col gap-3">

          {/* WORKSHOP POPOVER */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-lg hover:bg-zinc-800 transition">
                <LayoutGrid size={18} />
               <Link to={'/home'}> Workshops</Link>
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-72">
              <div className="space-y-5">

                {/* Created */}
                <div>
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2">
                    My Workshops
                  </h3>
                  {createdWorkshops?.length > 0 ? (
                    createdWorkshops.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => SingleWorkshopStore(item)}
                        className="text-sm cursor-pointer px-2 py-1.5 rounded-md hover:bg-zinc-100 transition"
                      >
                        {item?.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400">
                      No Workshops
                    </p>
                  )}
                </div>

                {/* Invited */}
                <div>
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2">
                    Invited ({invitedWorkshopLength})
                  </h3>
                  {invitedWorkshopLength > 0 ? (
                    invitedWorkshops.map((item, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          SingleWorkshopStore(item?.workshopId)
                        }
                        className="text-sm cursor-pointer px-2 py-1.5 rounded-md hover:bg-zinc-100 transition"
                      >
                        {item?.workshopId?.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400">
                      No Invites
                    </p>
                  )}
                </div>

              </div>
            </PopoverContent>
          </Popover>

          {/* NOTIFICATIONS */}
          <button
            onClick={() => setDialogNotification(true)}
            className="flex items-center justify-between text-sm font-medium px-3 py-2 rounded-lg hover:bg-zinc-800 transition"
          >
            <div className="flex items-center gap-3">
              <Bell size={18} />
              Notifications
            </div>

            {notificationLength > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {notificationLength}
              </span>
            )}
          </button>

          {/* SETTINGS */}
          <Link
            to="/settings"
            className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-lg hover:bg-zinc-800 transition"
          >
            <Settings size={18} />
            Settings
          </Link>

          {/* FILES */}
          <Link
            to="/file"
            className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-lg hover:bg-zinc-800 transition"
          >
            <Folder size={18} />
            Files
          </Link>

        </div>
      </div>

      {/* ================= LOGOUT ================= */}
      <div>
        <button
          onClick={logoutHandler}
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 transition py-2.5 rounded-lg text-sm font-medium text-white"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* ================= NOTIFICATION DIALOG ================= */}
      <Dialog open={dialogNotification} onOpenChange={setDialogNotification}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>

          {getAllNotification?.length > 0 ? (
            <div className="flex flex-col gap-4 mt-4">

              <button
                onClick={() => markAllNotificationRead()}
                className="self-end text-xs bg-zinc-900 text-white px-3 py-1 rounded-md hover:bg-zinc-800 transition"
              >
                Mark All as Read
              </button>

              <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
                {getAllNotification.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 flex justify-between items-start gap-3"
                  >
                    <p className="text-sm text-zinc-700">
                      {item?.message}
                    </p>

                    <button
                      onClick={() =>
                        markNotificationRead(item._id)
                      }
                      className="text-xs bg-zinc-800 text-white px-2 py-1 rounded-md hover:bg-zinc-700 transition"
                    >
                      Read
                    </button>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <p className="text-sm text-zinc-500 mt-4">
              No Notifications
            </p>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default SideBar
