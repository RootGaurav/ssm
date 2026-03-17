"use client";

import StatCard from "@/components/StatCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:5000";

async function getStats(token: string) {
  const res = await fetch(`${API_BASE}/api/dashboard/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load stats");
  }

  return res.json();
}

async function getCurrentUser(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  return res.json();
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.push("/admin/login");
      return;
    }

    getCurrentUser(token)
      .then((data) => {
        if (data.user?.role !== "admin") {
          router.push("/login");
          return;
        }

        return getStats(token);
      })
      .then((payload) => {
        if (payload) {
          setStats(payload);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome to society management system.</p>

        <div className="grid grid-cols-4 gap-6">
          <StatCard title="Total Flats" value={stats.total_flats} />
          <StatCard title="Total Collection" value={`₹${stats.total_collection}`} />
          <StatCard title="Pending Payments" value={stats.pending_payments} />
          <StatCard title="Paid Payments" value={stats.paid_payments} />
        </div>
      </div>
    </div>
  );
}