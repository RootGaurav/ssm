"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:5000";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthenticated");
        return res.json();
      })
      .then((data) => {
        if (data.user?.role !== "user") {
          router.push("/admin/dashboard");
          return;
        }
        setUser(data.user);
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Redirecting...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Resident Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome, {user.name || "Resident"}! You are logged in successfully.</p>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            <p className="text-gray-600 mt-2">Pay subscriptions, view history, update profile.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            <p className="text-gray-600 mt-2">Check for updates and announcements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}