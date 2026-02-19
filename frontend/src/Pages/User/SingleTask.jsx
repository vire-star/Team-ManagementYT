import { useCreateFileHook, useGetPublicFileHook } from '@/hook/file.hook'
import { useGetSingleTaskHook } from '@/hook/task.hook'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
import { useCreateCommentHook, useGetCommentHook } from '@/hook/comment.hook'

const SingleTask = () => {
  const { id } = useParams()
  const { register, handleSubmit } = useForm()
  const { data: SingleTask } = useGetSingleTaskHook(id)

  const [Comment, setComment] = useState("")
  const [showUser, setshowUser] = useState(false)
  const [filteredUser, setfilteredUser] = useState([])
  const [openFileDialog, setopenFileDialog] = useState(false)

  const { data: publicFile } = useGetPublicFileHook(id)
  const { mutate: createFile, isPending } = useCreateFileHook()

  const fileHandler = (data) => {
    const formData = new FormData()
    formData.append('url', data.url[0])
    formData.append('visibility', 'workshop')
    formData.append('workshopId', SingleTask?.workshopId)
    formData.append('taskId', SingleTask?._id)

    createFile(formData, {
      onSuccess: () => setopenFileDialog(false)
    })
  }

  const { data: getComment } = useGetCommentHook(id)
  const { mutate: CreateComment } = useCreateCommentHook()

  const commentHandler = (e) => {
    e.preventDefault()
    CreateComment({ id, text: Comment }, {
      onSuccess: () => setComment("")
    })
  }

  const handleChange = (e) => {
    const value = e.target.value
    setComment(value)

    const lastWord = value.split(" ").pop()

    if (lastWord.startsWith("@")) {
      const searchText = lastWord.slice(1).toLowerCase()
      const filtered = SingleTask?.assignees?.filter(user =>
        user.name.toLowerCase().includes(searchText)
      )
      setfilteredUser(filtered)
      setshowUser(true)
    } else {
      setshowUser(false)
    }
  }

  const handleSelectUser = (user) => {
    const words = Comment.split(" ")
    words.pop()
    const newText = words.join(" ") + ` @${user.name}`
    setComment(newText)
    setshowUser(false)
  }

  const commentEndRef = useRef(null)

  useEffect(() => {
    commentEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [getComment])

  return (
    <div className='h-screen w-full flex flex-col bg-slate-100'>

      {/* HEADER */}
      <div className='bg-white shadow-sm px-8 py-6 border-b'>
        <h1 className='text-2xl font-bold text-slate-800'>
          {SingleTask?.title}
        </h1>
        <p className='text-slate-600 mt-1'>
          {SingleTask?.description}
        </p>
        <div className='mt-2 text-sm text-slate-500'>
          Members Assigned: {SingleTask?.assignees?.length}
        </div>
      </div>

      {/* MAIN */}
      <div className='flex flex-1 overflow-hidden'>

        {/* LEFT - FILE SECTION */}
        <div className='w-[60%] p-6 flex flex-col bg-slate-50'>

          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold text-slate-700'>
              Task Files
            </h2>
            <button
              onClick={() => setopenFileDialog(true)}
              className='bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition'
            >
              Upload File
            </button>
          </div>

          <div className='flex-1 overflow-y-auto bg-white rounded-xl shadow-sm p-6'>
            {publicFile?.length > 0 ? (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
                {publicFile.map((item, index) => (
                  <div
                    key={index}
                    className='border rounded-xl p-4 text-center hover:shadow-md transition'
                  >
                    <div className='text-4xl mb-2'>📄</div>
                    <p className='text-sm font-medium truncate'>
                      {item.name}
                    </p>
                    <a
                      href={item.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-xs text-blue-600 hover:underline mt-2 inline-block'
                    >
                      View File
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex items-center justify-center h-full text-slate-400'>
                No files uploaded yet
              </div>
            )}
          </div>
        </div>

        {/* RIGHT - COMMENT SECTION */}
        <div className='w-[40%] flex flex-col bg-white border-l'>

          {/* COMMENT LIST */}
          <div className='flex-1 overflow-y-auto p-6 space-y-4'>
            <h2 className='text-lg font-semibold text-slate-700'>
              Comments
            </h2>

            {getComment?.length > 0 ? (
              getComment.map((item, index) => (
                <div
                  key={index}
                  className='bg-slate-100 p-4 rounded-xl'
                >
                  <p className='text-sm text-slate-800'>
                    {item.text}
                  </p>
                  <p className='text-xs text-slate-500 mt-2'>
                    By {item?.authorId?.name}
                  </p>
                </div>
              ))
            ) : (
              <p className='text-slate-400 text-sm'>
                No comments yet
              </p>
            )}

            <div ref={commentEndRef}></div>
          </div>

          {/* COMMENT INPUT */}
          <div className='p-4 border-t relative'>

            {showUser && (
              <div className='absolute bottom-20 left-4 right-4 bg-white shadow-lg border rounded-lg max-h-40 overflow-y-auto z-50'>
                {filteredUser?.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectUser(item)}
                    className='px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm'
                  >
                    @{item.name}
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={commentHandler} className='flex gap-2'>
              <input
                value={Comment}
                onChange={handleChange}
                type="text"
                placeholder='Write a comment...'
                className='flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-700 outline-none'
              />

              <button
                type="submit"
                className='bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition'
              >
                Send
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* FILE UPLOAD DIALOG */}
      <Dialog open={openFileDialog} onOpenChange={setopenFileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(fileHandler)}
            className='flex flex-col gap-4 mt-4'
          >
            <input
              type="file"
              {...register('url')}
              className='border p-2 rounded-lg'
            />

            <button
              type='submit'
              className='bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition'
            >
              {isPending ? "Uploading..." : "Upload"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default SingleTask
