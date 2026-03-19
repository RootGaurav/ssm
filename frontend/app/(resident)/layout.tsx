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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    <div className="h-screen overflow-hidden flex bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Desktop Sidebar */}
      {loggedIn && <ResidentSidebar userName={residentName} className="hidden lg:block" />}

      {/* Mobile Sidebar Overlay */}
      {loggedIn && sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu overlay"
          />
          <ResidentSidebar
            userName={residentName}
            className="relative z-10"
            onLinkClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white shadow">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex justify-between items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {loggedIn && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                  aria-label="Open menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <h1 className="text-base sm:text-xl font-bold text-green-600 truncate">Society Portal - {residentName}</h1>
            </div>

            {loggedIn && (
              <button
                onClick={() => logout("/login")}
                className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition duration-200 text-sm sm:text-base"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        <main className="p-3 sm:p-6 flex-1 min-h-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
