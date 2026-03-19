"use client"


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

import { useEffect, useState } from "react"
import { getDashboardStats } from "@/services/api"
import { Line } from "react-chartjs-2"  
import StatCard from  "@/components/StatCard"

export default function DashboardPage(){

    const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return "₹" + value.toLocaleString();
          }
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };


  const [data,setData] = useState<any>(null)

  async function loadDashboard(){

    const result = await getDashboardStats()

    if(!result.error){
      setData(result)
    }

  }

  useEffect(()=>{
    loadDashboard()
  },[])

  if(!data) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    </div>
  )

  const labels = data.monthlyTrend.map(
    (r:any)=>`${r.month}/${r.year}`
  )

  const values = data.monthlyTrend.map(
    (r:any)=>Number(r.total_collection)
  )

  const chartData = {
    labels,
    datasets:[
      {
        label:"Monthly Revenue",
        data:values,
        borderColor:"#16a34a",
        backgroundColor:"rgba(22,163,74,0.2)",
        tension:0.3
      }
    ]
  }

  const totalFlats = Number(data.totalFlats || 0)
  const occupiedFlats = Number(data.occupiedFlats || 0)
  const pendingPayments = Number(data.pendingPayments || 0)
  const totalCollection = Number(data.totalCollection || 0)
  const vacantFlats = Math.max(totalFlats - occupiedFlats, 0)
  const occupancyRate = totalFlats > 0 ? ((occupiedFlats / totalFlats) * 100).toFixed(1) : "0.0"
  const avgCollectionPerFlat = totalFlats > 0 ? Math.round(totalCollection / totalFlats) : 0

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`

  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Overview of society management and financial metrics
              </p>
            </div>
          </div>
        </div>



        {/* STAT CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            title="Total Flats"
            value={totalFlats}
            subtitle={`${vacantFlats} flat${vacantFlats === 1 ? "" : "s"} available`}
            badge="Inventory"
            description={`Occupied flats: ${occupiedFlats}`}
            tone="info"
            actionLabel="Manage"
            actionHref="/admin/flats"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />

          <StatCard
            title="Occupied Flats"
            value={occupiedFlats}
            subtitle={`Utilization: ${occupancyRate}%`}
            badge="Utilization"
            description={`Available flats: ${vacantFlats}`}
            tone="success"
            actionLabel="View Flats"
            actionHref="/admin/flats"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />

          <StatCard
            title="Total Collection"
            value={formatCurrency(totalCollection)}
            subtitle={`Avg ${formatCurrency(avgCollectionPerFlat)} per flat`}
            badge="Revenue"
            description={`${labels.length} months tracked`}
            tone="success"
            actionLabel="View Reports"
            actionHref="/admin/reports"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <StatCard
            title="Pending Payments"
            value={pendingPayments}
            subtitle={pendingPayments === 0 ? "All clear for now" : "Needs collection follow-up"}
            badge={pendingPayments === 0 ? "Healthy" : "Attention"}
            description={`Pending across ${totalFlats} flats`}
            tone={pendingPayments === 0 ? "success" : "danger"}
            actionLabel="Resolve"
            actionHref="/admin/monthly-records"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
          />

        </div>



        {/* CHART */}

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Monthly Revenue Trend
              </h2>
              <p className="text-gray-600">
                Track your society's financial performance over time
              </p>
            </div>
          </div>
              
            <StatCard
              title="Revenue Overview"
              actionLabel="Open Reports"
              actionHref="/admin/reports"
            >
              <Line data={chartData} options={options} />
            </StatCard>
    </div>

      </div>

    </div>

  )

}
