"use client";
import { logout } from "@/utils/logout";
import { isLoggedIn } from "@/utils/auth";
import { useEffect, useState } from "react";

export default function AdminNavbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 p-4 flex justify-between items-center">
      <h2 className="font-bold text-gray-800 text-xl">
        Admin Panel
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-600 font-medium">Admin</span>
        {loggedIn && (
          <button
            onClick={() => logout("/admin/login")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}