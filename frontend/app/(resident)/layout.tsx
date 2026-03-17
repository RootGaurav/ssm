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
          <h1 className="text-xl font-bold text-green-600">Society Portal</h1>

          {loggedIn && (
            <button
              onClick={() => logout("/login")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto p-6 flex gap-6">
        {loggedIn && (
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="w-64 bg-white text-gray-800 min-h-[calc(100vh-96px)] p-6 border border-gray-200 rounded-2xl shadow">
                <h2 className="text-lg font-bold mb-6">Resident</h2>
                <nav className="flex flex-col gap-3">
                  <a
                    href="/dashboard"
                    className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/subscriptions"
                    className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
                  >
                    Subscriptions
                  </a>
                  <a
                    href="/pay-now"
                    className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
                  >
                    Pay Now
                  </a>
                  <a
                    href="/profile"
                    className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
                  >
                    Profile
                  </a>
                </nav>
              </div>
            </div>
          </aside>
        )}

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}