"use client"

import { useEffect, useState } from "react"

import {
  getMonthlyRecords,
  generateMonthlyRecords,
  markRecordPaid
} from "@/services/api"

export default function MonthlyRecordsPage(){

  const today = new Date()

  const [month,setMonth] = useState(today.getMonth()+1)
  const [year,setYear] = useState(today.getFullYear())

  const [records,setRecords] = useState<any[]>([])
  const [confirmRecord,setConfirmRecord] = useState<any>(null)
  const [markingId,setMarkingId] = useState<number | null>(null)
  const [error,setError] = useState("")



  async function loadRecords(){

    const data = await getMonthlyRecords(month,year)

    if(Array.isArray(data)){
      setRecords(data)
    }

  }



  useEffect(()=>{
    loadRecords()
  },[month,year])



  async function handleGenerate(){

    await generateMonthlyRecords(month,year)

    loadRecords()

  }



  async function handleMarkPaid(id:number){
    setMarkingId(id)
    setError("")

    const previous = records

    // Optimistic UI: show paid immediately and hide action button.
    setRecords((prev)=>
      prev.map((r:any)=>
        r.id === id ? {...r,status:"paid"} : r
      )
    )

    const result = await markRecordPaid(id)

    if(result?.error){
      setError(result.error)
      setRecords(previous)
      setMarkingId(null)
      return
    }

    setConfirmRecord(null)
    setMarkingId(null)
    await loadRecords()

  }



  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Monthly Subscription Records
        </h1>

        <p className="text-gray-600 mb-8">
          View and manage monthly subscription payments for flats
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}



        <div className="flex gap-4 mb-8 items-center">

          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Month:</label>
            <select
              value={month}
              onChange={(e)=>setMonth(Number(e.target.value))}
              className="text-black border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {[...Array(12)].map((_,i)=>(
                <option key={i+1} value={i+1}>
                  {i+1}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Year:</label>
            <input
              type="number"
              value={year}
              onChange={(e)=>setYear(Number(e.target.value))}
              className="w-32 text-black border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Generate Records
          </button>

        </div>



        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left font-semibold text-gray-700">Flat</th>
              <th className="p-4 text-left font-semibold text-gray-700">Owner</th>
              <th className="p-4 text-left font-semibold text-gray-700">Amount</th>
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left font-semibold text-gray-700">Action</th>

            </tr>

          </thead>



          <tbody>

            {records.map((r:any)=>(

              <tr key={r.id} className="border-t border-gray-200">

                <td className="p-4 font-medium text-gray-800">{r.flat_number}</td>

                <td className="p-4 text-gray-700">
                  <div className="font-semibold">{r.owner_name || "N/A"}</div>
                  <div className="text-sm text-gray-500">{r.owner_email || ""}</div>
                  <div className="text-sm text-gray-500">{r.owner_phone || ""}</div>
                </td>

                <td className="p-4 text-gray-700">₹{r.amount}</td>

                <td className="p-4">

                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    r.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {r.status === "paid" ? "✅ Paid" : "⏳ Pending"}
                  </span>

                </td>

                <td className="p-4">

                  {r.status === "pending" && (

                    <button
                      onClick={()=>setConfirmRecord(r)}
                      disabled={markingId === r.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                    >
                      {markingId === r.id ? "Marking..." : "Mark Paid"}
                    </button>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {confirmRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                Mark As Paid
              </h2>

              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to mark <span className="font-semibold">{confirmRecord.flat_number}</span> as paid?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={()=>setConfirmRecord(null)}
                  disabled={markingId === confirmRecord.id}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={()=>handleMarkPaid(confirmRecord.id)}
                  disabled={markingId === confirmRecord.id}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 shadow-md"
                >
                  {markingId === confirmRecord.id ? "Marking..." : "Yes, Mark Paid"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>

  )

}
