"use client"

import { useEffect,useState } from "react"
import { getSubscriptions } from "@/services/api"
import Link from "next/link"

export default function Subscriptions(){

  const [data,setData] = useState<any[]>([])
  const [hasAssignedFlat, setHasAssignedFlat] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function load(){

    const result = await getSubscriptions()

    if (result.error) {
      setError(result.error)
      return
    }

    setHasAssignedFlat(result.hasAssignedFlat !== false)
    setMessage(result.message || "")
    setData(result.subscriptions || [])

  }

  useEffect(()=>{
    load()
  },[])

  if(error){
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-lg font-semibold text-red-600 mb-2">Unable to load subscriptions</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if(!hasAssignedFlat){
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-6xl mx-auto">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <h1 className="text-2xl font-bold text-amber-900 mb-2">No Flat Assigned</h1>
            <p className="text-amber-800">{message || "No flat is currently assigned to your account."}</p>
            <p className="mt-2 text-sm text-amber-700">
              Your subscription history will appear here once an admin assigns a flat.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if(!data || data.length === 0){
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">No subscriptions found</p>
          </div>
        </div>
      </div>
    )
  }

  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-6xl mx-auto">

        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Monthly Subscriptions
              </h1>
              <p className="text-gray-600">
                View your payment history and subscription details
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Flat Number</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Flat Type</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Month</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Year</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Amount</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Payment Mode</th>
                <th className="px-6 py-4 text-center text-gray-700 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>

              {data.map((s:any,i:number)=>(
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition duration-200">

                  <td className="px-6 py-4 text-gray-800 font-medium">{s.flat_number}</td>
                  <td className="px-6 py-4 text-gray-800">{s.flat_type}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{s.month}</td>
                  <td className="px-6 py-4 text-gray-800">{s.year}</td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">₹{s.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      s.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {s.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{s.payment_mode || "-"}</td>

                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/subscriptions/${s.year}/${s.month}?flat_id=${s.flat_id}`}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View
                    </Link>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

      </div>

    </div>
  )

}
