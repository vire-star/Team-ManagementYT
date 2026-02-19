import React, { useState } from "react"
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core"
import { useWorkshopStore } from "@/store/WorkShopStore"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLeaveWorkshopMemberHook } from "@/hook/workshop.hook"
import { useForm } from "react-hook-form"
import {
  useChangeStatusHook,
  useCreateTaskHook,
  useDeleteTaskHook,
  useGetAllTaskHook,
} from "@/hook/task.hook"
import { MenuIcon, Trash } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "@/store/UserStore"
import { toast } from "sonner"

const Home = () => {
  const workshop = useWorkshopStore((state) => state.workshop)
  const { register, handleSubmit } = useForm()
  const [openPopover, setOpenPopover] = useState(false)
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [activeTask, setActiveTask] = useState(null)

  const { data: getAllTask } = useGetAllTaskHook(workshop?._id)
  const { mutate: updateStatus } = useChangeStatusHook()
  const { mutate: leaveWorkshop } = useLeaveWorkshopMemberHook()
  const { mutate: createTask, isPending } = useCreateTaskHook()

  const tasks = getAllTask || []

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return

    updateStatus({
      id: active.id,
      status: over.id,
    })
    setActiveTask(null)
  }

  const submitTaskHandler = (data) => {
    createTask(
      { ...data, id: workshop?._id },
      { onSuccess: () => setOpenTaskDialog(false) }
    )
  }

  return (
    <div className="w-full h-screen bg-slate-100 flex flex-col">
      {/* HEADER */}
      
    {/* ================= HEADER ================= */}
    <div className="h-[70px] bg-white border-b border-slate-200 
                    flex items-center justify-between px-10">

      <div>
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
          {workshop?.name || "Workspace"}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage tasks efficiently
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpenTaskDialog(true)}
          className="px-4 py-2 text-sm rounded-md 
                     bg-slate-900 text-white 
                     hover:bg-slate-800 transition"
        >
          New Task
        </button>

        <button
          onClick={() => setOpenPopover(true)}
          className="px-4 py-2 text-sm rounded-md 
                     border border-slate-300 
                     text-slate-600 
                     hover:bg-slate-100 transition"
        >
          Leave
        </button>
      </div>
    </div>

    {/* ================= BOARD ================= */}
    <div className="flex-1 overflow-x-auto px-10 py-8">
      <div className="min-w-[1100px] h-full">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={(event) => {
            const task = tasks.find((t) => t._id === event.active.id)
            setActiveTask(task)
          }}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full">
            <Column title="Todo" status="todo" tasks={tasks} />
            <Column title="In Progress" status="in-progress" tasks={tasks} />
            <Column title="Completed" status="done" tasks={tasks} />
          </div>

          <DragOverlay>
            {activeTask ? <Task task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>

      {/* LEAVE POPOVER */}
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <span className="hidden" />
        </PopoverTrigger>
        <PopoverContent className="rounded-xl">
          <PopoverHeader>
            <PopoverTitle className="text-red-600">
              Leave Workshop?
            </PopoverTitle>
          </PopoverHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-slate-600">
              This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => leaveWorkshop(workshop?._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Leave
              </button>
              <button
                onClick={() => setOpenPopover(false)}
                className="px-4 py-2 bg-slate-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* CREATE TASK DIALOG */}
      <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(submitTaskHandler)}
            className="flex flex-col gap-4 mt-4"
          >
            <input
              {...register("title")}
              placeholder="Task title"
              className="p-2 border rounded-lg"
            />
            <input
              {...register("description")}
              placeholder="Task description"
              className="p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="bg-slate-800 text-white py-2 rounded-lg"
            >
              {isPending ? "Creating..." : "Create Task"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Home

/* ================= TASK ================= */

const Task = ({ task, isOverlay }) => {
  const navigate = useNavigate()
  const { mutate } = useDeleteTaskHook()
  const user = useUserStore((state) => state.user)

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
      disabled: isOverlay,
    })

  // ✅ Access Logic
  const isCreator =
    task?.creatorId?.toString() === user?._id?.toString()

  const isAssignee =
    task?.assignees?.some((assignee) => {
      const assigneeId = assignee?._id
        ? assignee._id.toString()
        : assignee?.toString()
      return assigneeId === user?._id?.toString()
    }) || false

  const canAccess = isCreator || isAssignee

  const handleNavigate = (e) => {
    e.stopPropagation()

    if (!canAccess) {
      toast.error("You are not assigned to this task")
      return
    }

    navigate(`/singleTask/${task._id}`)
  }

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={isOverlay ? null : setNodeRef}
      style={style}
      className={`bg-white border border-slate-200 
                 rounded-md px-3 py-3 
                 hover:shadow-sm transition 
                 flex items-center justify-between
                 ${!canAccess ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {/* Title */}
      <div
        className="text-sm font-medium text-slate-700 cursor-pointer"
        onClick={handleNavigate}
      >
        {task.title}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab text-slate-400 hover:text-slate-600"
        >
          <MenuIcon size={16} />
        </div>

        {isCreator && (
          <Trash
            size={16}
            className="text-slate-400 hover:text-red-500 cursor-pointer transition"
            onClick={(e) => {
              e.stopPropagation()
              mutate(task._id)
            }}
          />
        )}
      </div>
    </div>
  )
}


/* ================= COLUMN ================= */

const Column = ({ title, status, tasks }) => {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className="flex-1 bg-white border border-slate-200 
                 rounded-lg flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            {title}
          </h2>
          <span className="text-xs text-slate-400">
            {
              tasks.filter((task) => task.status === status).length
            }
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
        {tasks
          ?.filter((task) => task.status === status)
          .map((task) => (
            <Task key={task._id} task={task} />
          ))}
      </div>
    </div>
  )
}
