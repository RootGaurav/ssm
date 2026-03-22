"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/services/api"

export default function AdminLogin(){

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")

  async function handleSubmit(e:any){

    e.preventDefault()

    const res = await login({
      email,
      password
    })

    if (res.token) {
      if (res.user?.role !== "admin") {
        setError("You must login with an admin account")
        return
      }

      document.cookie = `token=${res.token}; path=/`
      router.push("/admin/dashboard")
    } else {
      setError(res.error)
    }

  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Admin Login
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Access the society management dashboard
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Enter admin email"
            className="w-full text-black border border-gray-300 placeholder:text-gray-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Login
          </button>

        </form>

      </div>

    </div>

  )

}
