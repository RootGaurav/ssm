"use client";

import { useParams } from "next/navigation";

export default function MonthPage() {
  const params = useParams();
  const month = params?.month as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">{month} Subscription</h1>
        <p className="text-gray-600 mb-8">Details for your {month} subscription.</p>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-gray-800">Subscription Status</h3>
          <p className="text-gray-600 mt-2">Paid - ₹500</p>
        </div>
      </div>
    </div>
  );
}
