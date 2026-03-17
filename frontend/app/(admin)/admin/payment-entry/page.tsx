"use client";

import { useState } from "react";

export default function PaymentEntryPage() {
  const [flatId, setFlatId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const submitPayment = () => {
    alert("Payment recorded!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Entry</h1>
        <p className="text-gray-600 mb-8">Record payments from residents.</p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Flat ID"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={flatId}
            onChange={(e) => setFlatId(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="date"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            onClick={submitPayment}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Record Payment
          </button>
        </div>
      </div>
    </div>
  );
}
