import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-green-50 px-4">

      <div className="relative bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center border border-gray-200">

        {/* Glow effect */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-300 rounded-full blur-3xl opacity-30"></div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
          Society Portal
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Manage subscriptions, payments, and reports with ease.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">

          <Link
            href="/login"
            className="group w-full bg-green-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition-all duration-200 hover:scale-[1.02] shadow-md"
          >
            Login as Resident
            <span className="group-hover:translate-x-1 transition">→</span>
          </Link>

          <Link
            href="/admin/login"
            className="group w-full bg-gray-900 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black transition-all duration-200 hover:scale-[1.02] shadow-md"
          >
            Login as Admin
            <span className="group-hover:translate-x-1 transition">→</span>
          </Link>

        </div>

        {/* Footer hint */}
        <p className="text-xs text-gray-400 mt-8">
          Secure • Fast • Reliable
        </p>

      </div>
    </div>
  )
}