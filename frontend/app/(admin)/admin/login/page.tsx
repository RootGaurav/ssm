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

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">

      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">

        <h1 className="text-2xl text-black font-bold text-center mb-2">
          Admin Login
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Society Management Panel
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Admin Email"
            className="w-full text-black border placeholder:text-gray-500 p-3 rounded focus:ring-2 focus:ring-gray-700"
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full text-black placeholder:text-gray-500 border p-3 rounded focus:ring-2 focus:ring-gray-700"
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button
            className="w-full bg-gray-900 text-white py-3 rounded hover:bg-black transition"
          >
            Login
          </button>

        </form>

      </div>

    </div>

  )

}