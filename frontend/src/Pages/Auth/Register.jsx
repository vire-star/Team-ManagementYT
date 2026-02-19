import { useRegisterHook } from '@/hook/user.hook'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'

const Register = () => {

  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get('invite')

  const { register, handleSubmit } = useForm()
  const { mutate, isPending } = useRegisterHook()

  const registerformHandler = (data) => {
    mutate({ ...data, inviteToken })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Create Account 🚀
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Start managing your workshops efficiently
          </p>
        </div>

        {/* Invite Info */}
        {inviteToken && (
          <div className="mb-4 bg-emerald-50 text-emerald-700 text-sm px-3 py-2 rounded-lg border border-emerald-200">
            You are joining via invitation link
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(registerformHandler)}
          className="flex flex-col gap-5"
        >

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name")}
              className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-700 transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-700 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              {...register("password")}
              className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-700 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition"
          >
            {isPending ? "Registering..." : "Register"}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-slate-900 font-medium hover:underline"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Register
