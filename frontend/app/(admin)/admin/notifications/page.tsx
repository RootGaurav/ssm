"use client";

import { useState } from "react";

export default function NotificationsPage() {
  const [message, setMessage] = useState("");

  const sendNotification = () => {
    alert("Notification sent!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h1>
        <p className="text-gray-600 mb-8">Send notifications to residents.</p>

        <div className="space-y-4">
          <textarea
            placeholder="Enter notification message"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 h-32"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={sendNotification}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}
