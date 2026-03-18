"use client"

import { useEffect, useState } from "react"
import { logout } from "@/utils/logout"
import { isLoggedIn } from "@/utils/auth"
import ResidentSidebar from "@/components/ResidentSidebar"
import { getResidentProfile } from "@/services/api"

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [residentName, setResidentName] = useState("Resident")

  useEffect(() => {
    setLoggedIn(isLoggedIn())

    async function loadProfile() {
      const user = await getResidentProfile()
      if (!user?.error && user?.name) {
        setResidentName(user.name)
      }
    }

    loadProfile()
  }, [])

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      {loggedIn && <ResidentSidebar userName={residentName} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-green-600">Society Portal - {residentName}</h1>

            {loggedIn && (
              <button
                onClick={() => logout("/login")}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  )
}
