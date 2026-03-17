"use client"

import { useEffect, useState } from "react"
import {
  getMonthlyReport,
  getYearlyReport,
  getPendingPayments
} from "@/services/api"

export default function ReportsPage(){

  const [monthly,setMonthly] = useState<any[]>([])
  const [yearly,setYearly] = useState<any[]>([])
  const [pending,setPending] = useState<any>(null)

  async function loadReports(){

    const m = await getMonthlyReport()
    const y = await getYearlyReport()
    const p = await getPendingPayments()

    if(Array.isArray(m)) setMonthly(m)
    if(Array.isArray(y)) setYearly(y)
    if(p) setPending(p)

  }

  useEffect(()=>{
    loadReports()
  },[])



  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Financial Reports
        </h1>

        <p className="text-gray-600">
          View collection summaries and track what’s due for each month.
        </p>



        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-500 text-sm">Pending Payments</h2>
                <p className="text-3xl font-bold text-red-600">₹{pending?.pending_amount || 0}</p>
              </div>
              <div className="text-red-600 bg-red-50 p-3 rounded-full">
                💸
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-500 text-sm">Pending Flats</h2>
                <p className="text-3xl font-bold text-gray-800">{pending?.pending_count || 0}</p>
              </div>
              <div className="text-yellow-600 bg-yellow-50 p-3 rounded-full">
                🏠
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-500 text-sm">Total Collected</h2>
                <p className="text-3xl font-bold text-green-600">₹{monthly.reduce((sum:any, r:any) => sum + Number(r.total_collection || 0), 0)}</p>
              </div>
              <div className="text-green-600 bg-green-50 p-3 rounded-full">
                📈
              </div>
            </div>
          </div>

        </div>



        {/* MONTHLY REPORT */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl text-gray-800 font-semibold mb-4">
            Monthly Collection
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700">Month</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Year</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Total</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Cash</th>
                  <th className="p-4 text-left font-semibold text-gray-700">UPI</th>
                </tr>
              </thead>
              <tbody>
                {monthly.length === 0 ? (
                  <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-600">
                      No monthly collection data available.
                    </td>
                  </tr>
                ) : (
                  monthly.map((r:any)=>(
                    <tr key={`${r.month}-${r.year}`} className="border-t hover:bg-gray-50">
                      <td className="p-4 text-gray-800 font-medium">{r.month}</td>
                      <td className="p-4 text-gray-800">{r.year}</td>
                      <td className="p-4 text-gray-800">₹{Number(r.total_collection)}</td>
                      <td className="p-4 text-gray-800">{r.cash_payments}</td>
                      <td className="p-4 text-gray-800">{r.upi_payments}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>



        {/* YEARLY REPORT */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl text-gray-800 font-semibold mb-4">
            Yearly Collection
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700">Year</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Total Collection</th>
                </tr>
              </thead>
              <tbody>
                {yearly.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-6 text-center text-gray-600">
                      No yearly collection data available.
                    </td>
                  </tr>
                ) : (
                  yearly.map((r:any)=>(
                    <tr key={r.year} className="border-t hover:bg-gray-50">
                      <td className="p-4 text-gray-800">{r.year}</td>
                      <td className="p-4 text-gray-800">₹{Number(r.total_collection)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>

  )

}