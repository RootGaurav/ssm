import Link from "next/link";

export default function ResidentSidebar() {
  return (
    <aside className="w-64 bg-white text-gray-800 min-h-screen p-6 border-r border-gray-200 shadow-lg">
      <h1 className="text-xl font-bold mb-8 text-gray-800">Resident</h1>
      <nav className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
        >
          Dashboard
        </Link>
        <Link
          href="/subscriptions"
          className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
        >
          Subscriptions
        </Link>
        <Link
          href="/pay-now"
          className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
        >
          Pay Now
        </Link>
        <Link
          href="/profile"
          className="hover:bg-green-100 p-2 rounded-lg transition duration-200 text-gray-700 hover:text-green-700"
        >
          Profile
        </Link>
      </nav>
    </aside>
  );
}
