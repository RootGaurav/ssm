"use client";

import { useState } from "react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("");

  const generateReport = () => {
    alert(`Generating ${reportType} report!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports</h1>
        <p className="text-gray-600 mb-8">Generate various reports for the society.</p>

        <div className="space-y-4">
          <select
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="">Select Report Type</option>
            <option value="payment">Payment Report</option>
            <option value="subscription">Subscription Report</option>
            <option value="flat">Flat Report</option>
          </select>

          <button
            onClick={generateReport}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
