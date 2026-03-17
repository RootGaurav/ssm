"use client"

import { useEffect, useState } from "react"
import { logout } from "@/utils/logout"
import { isLoggedIn } from "@/utils/auth"
export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode
}) {
     const [loggedIn,setLoggedIn] = useState(false)

  useEffect(()=>{
    setLoggedIn(isLoggedIn())
  },[])

  return (

    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}

      <header className="bg-white shadow">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-xl font-bold text-green-600">
            Society Portal
          </h1>

          {loggedIn &&(<button
            onClick={()=>logout("/login")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>)}

        </div>

      </header>

      {/* Page Content */}

      <main className="max-w-7xl mx-auto p-6">

        {children}

      </main>

    </div>

  )
}