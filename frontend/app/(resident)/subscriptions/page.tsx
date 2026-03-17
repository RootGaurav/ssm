"use client";

import Link from "next/link";

export default function SubscriptionsPage() {
  const months = ["January", "February", "March", "April", "May", "June"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Subscriptions</h1>
        <p className="text-gray-600 mb-8">View and manage your monthly subscriptions.</p>

        <div className="grid grid-cols-3 gap-4">
          {months.map((month) => (
            <Link
              key={month}
              href={`/resident/subscriptions/${month.toLowerCase()}`}
              className="bg-green-50 hover:bg-green-100 p-6 rounded-lg border border-green-200 text-center transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">{month}</h3>
              <p className="text-gray-600 mt-2">View details</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
