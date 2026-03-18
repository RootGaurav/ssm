"use client"
import { useEffect, useState } from "react"
import AdminSidebar from "@/components/AdminSidebar"
import AdminNavbar from "@/components/AdminNavbar"
import { getProfile } from "@/services/api"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [adminName, setAdminName] = useState("Admin")

  useEffect(() => {
    async function loadProfile() {
      const user = await getProfile()
      if (!user?.error && user?.name) {
        setAdminName(user.name)
      }
    }

    loadProfile()
  }, [])

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <AdminSidebar userName={adminName} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <AdminNavbar userName={adminName} />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
