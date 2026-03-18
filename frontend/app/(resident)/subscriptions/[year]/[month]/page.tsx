"use client"

import { useEffect,useState } from "react"
import { getSubscriptionDetail } from "@/services/api"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function SubscriptionDetail(){

  const params = useParams<{year:string,month:string}>()
  const searchParams = useSearchParams()

  const [data,setData] = useState<any>(null)

  async function load(){

    const result = await getSubscriptionDetail(
      Number(params.year),
      Number(params.month),
      searchParams.get("flat_id") ? Number(searchParams.get("flat_id")) : undefined
    )

    setData(result)

  }

  useEffect(()=>{
    load()
  },[params.year, params.month, searchParams])

  if(!data){
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading subscription details...</p>
          </div>
        </div>
      </div>
    )
  }

  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                Subscription Details
              </h1>
              <p className="text-gray-600">
                {new Date(data.year, data.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <Link
            href="/subscriptions"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Flat & Payment Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              Flat Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-600 font-medium">Flat Number</label>
                <p className="text-xl text-gray-800 font-semibold mt-1">{data.flat_number}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">Flat Type</label>
                <p className="text-xl text-gray-800 font-semibold mt-1">{data.flat_type}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">Month</label>
                <p className="text-xl text-gray-800 font-semibold mt-1">{data.month}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">Year</label>
                <p className="text-xl text-gray-800 font-semibold mt-1">{data.year}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">Amount</label>
                <p className="text-3xl text-green-600 font-bold mt-1">₹{data.amount}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">Status</label>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${
                    data.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {data.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Transaction Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              Transaction Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-600 font-medium">Payment Mode</label>
                <p className="text-lg text-gray-800 font-semibold mt-1">{data.payment_mode || "-"}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">Transaction ID</label>
                <p className="text-lg text-gray-800 font-semibold mt-1 break-words">{data.transaction_id || "Not available"}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">Payment Date</label>
                <p className="text-lg text-gray-800 font-semibold mt-1">
                  {data.payment_date
                    ? new Date(data.payment_date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : "Pending"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons
        {data.status === "paid" && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Download Receipt
            </button>
          </div>
        )} */}

      </div>

    </div>

  )

}
