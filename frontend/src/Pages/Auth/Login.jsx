import { Spinner } from '@/components/ui/spinner'
import { useLoginHook } from '@/hook/user.hook'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

const Login = () => {

  const { register, handleSubmit } = useForm()
  const { mutate, isPending } = useLoginHook()

  const loginFormHandler = (data) => {
    mutate(data)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome Back 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Login to continue to your workspace
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(loginFormHandler)}
          className="flex flex-col gap-5"
        >

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
              placeholder="Enter your password"
              {...register("password")}
              className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-700 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition flex items-center justify-center"
          >
            {isPending ? <Spinner /> : "Login"}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-slate-900 font-medium hover:underline"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Login
