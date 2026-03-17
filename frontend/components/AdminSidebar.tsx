import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white text-gray-800 min-h-screen p-6 border-r border-gray-200 shadow-lg">
      <h1 className="text-xl font-bold mb-8 text-gray-800">
        Society Admin
      </h1>
      <nav className="flex flex-col gap-4">
        <Link href="/admin/dashboard" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Dashboard
        </Link>
        <Link href="/admin/flats" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Flats
        </Link>
        <Link href="/admin/subscriptions" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Subscriptions
        </Link>
        <Link href="/admin/monthly-records" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Monthly Records
        </Link>
        <Link href="/admin/payment-entry" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Payment Entry
        </Link>
        <Link href="/admin/reports" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Reports
        </Link>
        <Link href="/admin/notifications" className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700">
          Notifications
        </Link>
      </nav>
    </aside>
  );
}