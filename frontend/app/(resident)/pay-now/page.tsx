"use client";

import { useState } from "react";

export default function PayNowPage() {
  const [amount, setAmount] = useState("");

  const handlePayment = () => {
    alert(`Processing payment of ₹${amount}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Pay Now</h1>
        <p className="text-gray-600 text-center mb-8">Make a payment for your subscription.</p>

        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handlePayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Pay ₹{amount || "0"}
          </button>
        </div>
      </div>
    </div>
  );
}
