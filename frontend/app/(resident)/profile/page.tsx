"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("1234567890");

  const handleUpdate = () => {
    alert("Profile updated!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Profile</h1>
        <p className="text-gray-600 text-center mb-8">Update your personal information.</p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={handleUpdate}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
