import Link from "next/link"

export default function Home() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center">

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Society Management Portal
        </h1>

        <p className="text-gray-500 mb-8">
          Manage society subscriptions, payments and reports
        </p>

        <div className="flex flex-col gap-4">

          <Link
            href="/login"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Login as Resident
          </Link>

          <Link
            href="/admin/login"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-black transition"
          >
            Login as Admin
          </Link>

        </div>

      </div>

    </div>

  )
}