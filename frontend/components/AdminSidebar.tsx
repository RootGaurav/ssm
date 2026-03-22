import Link from "next/link"

type AdminSidebarProps = {
  userName: string
  className?: string
  onLinkClick?: () => void
}

export default function AdminSidebar({ userName, className = "", onLinkClick }: AdminSidebarProps) {
  return (
    <aside className={`w-64 bg-white text-gray-800 h-screen sticky top-0 overflow-y-auto p-6 border-r border-gray-200 shadow-lg ${className}`}>
      <h1 className="font-serif text-2xl font-bold mb-8 text-gray-800 tracking-tight">{userName}</h1>
      <nav className="flex flex-col gap-4">
        <Link onClick={onLinkClick} href="/admin/profile" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Profile
        </Link>
        <Link onClick={onLinkClick} href="/admin/dashboard" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Dashboard
        </Link>
        <Link onClick={onLinkClick} href="/admin/flats" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Flats
        </Link>
        <Link onClick={onLinkClick} href="/admin/subscriptions" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Subscriptions
        </Link>
        <Link onClick={onLinkClick} href="/admin/monthly-records" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Monthly Records
        </Link>
        <Link onClick={onLinkClick} href="/admin/payment-entry" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Payment Entry
        </Link>
        <Link onClick={onLinkClick} href="/admin/reports" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Reports
        </Link>
        <Link onClick={onLinkClick} href="/admin/notifications" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Notifications
        </Link>
      </nav>
    </aside>
  )
}
