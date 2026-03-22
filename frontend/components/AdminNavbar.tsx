"use client"
import { logout } from "@/utils/logout"

type AdminNavbarProps = {
  userName: string
  onMenuClick?: () => void
}

export default function AdminNavbar({ userName, onMenuClick }: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-lg border-b border-gray-200 p-4 flex justify-between items-center gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="font-serif font-bold text-gray-800 text-xl sm:text-2xl truncate tracking-tight">
          Admin Panel
        </h2>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <span className="text-gray-600 font-medium truncate max-w-28 sm:max-w-48">{userName}</span>
        <button
          onClick={() => logout("/admin/login")}
          className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md text-sm sm:text-base"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
