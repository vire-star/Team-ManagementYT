import { useCreateFileHook, useGetPrivateFileHook } from '@/hook/file.hook'
import React, { useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
import { UploadCloud, FileText, Search } from "lucide-react"

const File = () => {
  const { register, handleSubmit } = useForm()
  const { data: privateFile } = useGetPrivateFileHook()
  const { mutate: createFile, isPending } = useCreateFileHook()

  const [searchQuery, setSearchQuery] = useState("")
  const [openFileDialog, setOpenFileDialog] = useState(false)

  const fileLength = privateFile?.length || 0

  const fileHandler = (data) => {
    const formData = new FormData()
    formData.append('url', data.url[0])
    formData.append('visibility', 'private')

    createFile(formData, {
      onSuccess: () => setOpenFileDialog(false)
    })
  }

  const filteredFile = useMemo(() => {
    if (!searchQuery) return privateFile

    const query = searchQuery.toLowerCase()
    return privateFile?.filter(file => {
      const name = file?.name?.toLowerCase()
      const ext = name?.split(".").pop()
      return name?.includes(query) || ext?.includes(query)
    })
  }, [searchQuery, privateFile])

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">

      {/* ===== HEADER ===== */}
      <div className="bg-white border-b px-6 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              My Private Files
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {fileLength} file{fileLength !== 1 && "s"} stored
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-slate-300 outline-none"
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={() => setOpenFileDialog(true)}
              className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900 transition"
            >
              <UploadCloud size={16} />
              Upload
            </button>

          </div>
        </div>
      </div>

      {/* ===== FILE GRID ===== */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">

          {filteredFile?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredFile.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border rounded-xl p-5 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition duration-200"
                >
                  <FileText className="h-10 w-10 text-slate-600 mb-3" />

                  <h2 className="text-sm font-medium text-slate-700 break-all">
                    {item.name}
                  </h2>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs font-medium text-blue-600 hover:underline"
                  >
                    View File
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500 text-center">
              <FileText className="h-12 w-12 mb-4 opacity-40" />
              <p className="text-sm">
                {searchQuery
                  ? "No files found matching your search."
                  : "No files uploaded yet."}
              </p>
            </div>
          )}

        </div>
      </div>

      {/* ===== UPLOAD DIALOG ===== */}
      <Dialog open={openFileDialog} onOpenChange={setOpenFileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New File</DialogTitle>
            <DialogDescription>
              Your file will be stored privately.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(fileHandler)}
            className="flex flex-col gap-4 mt-4"
          >
            <input
              type="file"
              {...register("url")}
              className="border rounded-lg p-2 text-sm"
            />

            <button
              type="submit"
              disabled={isPending}
              className="bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition text-sm"
            >
              {isPending ? "Uploading..." : "Upload File"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default File
