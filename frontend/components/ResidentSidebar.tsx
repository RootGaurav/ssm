import Link from "next/link"

type ResidentSidebarProps = {
  userName: string
  className?: string
  onLinkClick?: () => void
}

export default function ResidentSidebar({ userName, className = "", onLinkClick }: ResidentSidebarProps) {
  return (
    <aside className={`w-64 bg-white text-gray-800 h-screen sticky top-0 overflow-y-auto p-6 border-r border-gray-200 shadow-lg ${className}`}>
      <h1 className="text-xl font-bold mb-8 text-gray-800">{userName}</h1>
      <nav className="flex flex-col gap-3">
        <Link
          onClick={onLinkClick}
          href="/dashboard"
          className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
        >
          Dashboard
        </Link>
        <Link
          onClick={onLinkClick}
          href="/subscriptions"
          className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
        >
          Subscriptions
        </Link>
        <Link
          onClick={onLinkClick}
          href="/pay-now"
          className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
        >
          Pay Now
        </Link>
        <Link
          onClick={onLinkClick}
          href="/profile"
          className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
        >
          Profile
        </Link>
      </nav>
    </aside>
  )
}
