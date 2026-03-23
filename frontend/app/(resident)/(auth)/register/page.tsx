"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { register } from "@/services/api"

export default function RegisterPage(){

  const router = useRouter()

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [phone,setPhone] = useState("")
  const [error,setError] = useState("")

  async function handleSubmit(e:any){

    e.preventDefault()

    const res = await register({
      name,
      email,
      password,
      phone
    })

    if(res.token){

      document.cookie = `token=${res.token}; path=/`

      router.push("/dashboard")

    }else{

      setError(res.error)

    }

  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Resident Registration
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Create your society account
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 ">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e)=>setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Create Password"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e)=>setPhone(e.target.value)}
          />

          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-gray-600 text-sm mt-6">

          Already have an account?

          <a
            href="/login"
            className="text-green-600 ml-2 font-semibold hover:underline"
          >
            Login
          </a>

        </p>

      </div>

    </div>

  )

}