"use client";

import { useState } from "react";

export default function MonthlyRecordsPage() {
  const [selectedMonth, setSelectedMonth] = useState("January");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Monthly Records</h1>
        <p className="text-gray-600 mb-8">View and manage monthly subscription records.</p>

        <div className="mb-6">
          <select
            className="text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option>January</option>
            <option>February</option>
            <option>March</option>
          </select>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-gray-800">Records for {selectedMonth}</h3>
          <p className="text-gray-600 mt-2">Total collected: ₹10,000 | Pending: ₹2,000</p>
        </div>
      </div>
    </div>
  );
}
