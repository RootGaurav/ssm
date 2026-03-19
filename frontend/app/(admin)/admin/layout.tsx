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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    <div className="h-screen overflow-hidden flex bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Desktop Sidebar */}
      <AdminSidebar userName={adminName} className="hidden lg:block" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu overlay"
          />
          <AdminSidebar
            userName={adminName}
            className="relative z-10"
            onLinkClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {/* Top Navbar */}
        <AdminNavbar userName={adminName} onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-3 sm:p-6 flex-1 min-h-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
