"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { logout } from "@/utils/logout"
import { isLoggedIn } from "@/utils/auth"
import AdminSidebar from "@/components/AdminSidebar"
import AdminNavbar from "@/components/AdminNavbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
   const [loggedIn,setLoggedIn] = useState(false)

  useEffect(()=>{
    setLoggedIn(isLoggedIn())
  },[])
  

  return (

    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}

      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <AdminNavbar />

        <main className="p-6">

          {children}

        </main>

      </div>

    </div>

  )
}