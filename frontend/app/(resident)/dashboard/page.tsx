"use client"

import { useEffect,useState } from "react"
import { getResidentDashboard } from "@/services/api"

export default function ResidentDashboard(){

  const [data,setData] = useState<any>(null)

  async function loadDashboard(){

    const result = await getResidentDashboard()

    if(result.error){
  alert(result.error)
}else{
  setData(result)
}

  }

  useEffect(()=>{
    loadDashboard()
  },[])

  if(!data){
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-5xl mx-auto">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Resident Dashboard
          </h1>

          <p className="text-gray-600">
            Overview of your payments and society notifications
          </p>

        </div>


        {/* STATUS CARDS */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-gray-600 text-sm font-medium">
                Current Month Status
              </h2>
            </div>
            <p className={`text-2xl font-bold ${
              data.currentMonth?.status === "paid"
                ? "text-green-600"
                : "text-red-600"
            }`}>

              {data.currentMonth?.status?.toUpperCase() || "N/A"}

            </p>
          </div>


          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-gray-600 text-sm font-medium">
                Pending Amount
              </h2>
            </div>
            <p className="text-2xl font-bold text-red-600">

              ₹{data.pendingAmount || 0}

            </p>
          </div>

        </div>



        {/* RECENT PAYMENTS */}

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 mb-8">

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Recent Payments
              </h2>
              <p className="text-gray-600">
                Your latest payment transactions
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>
                  <th className="p-4 text-left text-gray-700 font-semibold">Month</th>
                  <th className="p-4 text-left text-gray-700 font-semibold">Year</th>
                  <th className="p-4 text-left text-gray-700 font-semibold">Amount</th>
                  <th className="p-4 text-left text-gray-700 font-semibold">Mode</th>
                </tr>

              </thead>

              <tbody>

                {data.recentPayments && data.recentPayments.length > 0 ? (
                  data.recentPayments.map((p:any,i:number)=>(
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">

                      <td className="p-4 text-gray-800">{p.month}</td>
                      <td className="p-4 text-gray-800">{p.year}</td>
                      <td className="p-4 text-gray-800 font-medium">₹{p.amount}</td>
                      <td className="p-4 text-gray-800">{p.payment_mode}</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No recent payments found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>
          </div>

        </div>



        {/* NOTIFICATIONS */}

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21c4.411 0 8-4.03 8-9s-3.589-9-8-9-8 4.03-8 9a9.06 9.06 0 001.832 5.683L4 21l4.868-8.317z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Notifications
              </h2>
              <p className="text-gray-600">
                Important updates and announcements
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {data.notifications && data.notifications.length > 0 ? (
              data.notifications.map((n:any)=>(
                <div key={n.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition duration-200">

                  <p className="font-semibold text-gray-800 mb-2">
                    {n.title}
                  </p>

                  <p className="text-gray-600 text-sm">
                    {n.message}
                  </p>

                  {n.created_at && (
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(n.created_at).toLocaleDateString()}
                    </p>
                  )}

                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No notifications available
              </div>
            )}
          </div>

        </div>

      </div>

    </div>

  )

}