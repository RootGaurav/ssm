"use client"

import { useEffect, useState } from "react"
import { createOfflinePayment, getFlats } from "@/services/api"

export default function PaymentEntryPage(){

  const [flats,setFlats] = useState<any[]>([])
  const [success,setSuccess] = useState(false)
  const [error,setError] = useState("")
  const [selectedFlatDetails, setSelectedFlatDetails] = useState<any>(null)

  const [form,setForm] = useState({
    flat_id:"",
    month:"",
    year:new Date().getFullYear(),
    amount:"",
    payment_mode:"cash"
  })


  async function loadFlats(){

    const data = await getFlats()

    if(Array.isArray(data)){
      setFlats(data)
    }

  }

  useEffect(()=>{
    loadFlats()
  },[])



  async function handleSubmit(e:any){

    e.preventDefault()

    const result = await createOfflinePayment(form)

    if(result.error){
      setError(result.error)
      setTimeout(() => setError(""), 5000)
      return
    }

    setSuccess(true)
    setTimeout(() => setSuccess(false), 5000)

    setForm({
      flat_id:"",
      month:"",
      year:new Date().getFullYear(),
      amount:"",
      payment_mode:"cash"
    })

  }



  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      {success && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 p-8 max-w-md w-full animate-pulse">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Payment Recorded Successfully!
              </h2>
              <p className="text-gray-600">
                The payment has been recorded and added to the system.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <span>❌</span>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manual Payment Entry
        </h1>

        <p className="text-gray-600 mb-8">
          Record offline payments for flat subscriptions
        </p>



        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Flat</label>
            <select
              className="w-full text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              value={form.flat_id}
              onChange={(e)=>{
                const flatId = e.target.value
                setForm({...form,flat_id:flatId})
                const selected = flats.find((f:any) => String(f.id) === flatId)
                setSelectedFlatDetails(selected)
              }}
              required
            >
              <option value="">Select Flat</option>
              {flats.filter((f:any) => f.status === "occupied").map((f:any)=>(
                <option key={f.id} value={f.id}>
                  {f.flat_number}
                </option>
              ))}
            </select>
          </div>

          {selectedFlatDetails && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Owner Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Flat Number:</span>
                  <span className="font-medium text-gray-800">{selectedFlatDetails.flat_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flat Type:</span>
                  <span className="font-medium text-gray-800">{selectedFlatDetails.flat_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner Name:</span>
                  <span className="font-medium text-gray-800">{selectedFlatDetails.owner_name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner Email:</span>
                  <span className="font-medium text-gray-800">{selectedFlatDetails.owner_email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-800">{selectedFlatDetails.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium px-2 py-1 rounded text-xs ${
                    selectedFlatDetails.status === "occupied"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {selectedFlatDetails.status?.toUpperCase() || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}



          <div>
            <label className="block text-gray-700 font-medium mb-2">Month (1-12)</label>
            <input
              type="number"
              min="1"
              max="12"
              placeholder="Enter month"
              className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              value={form.month}
              onChange={(e)=>setForm({...form,month:e.target.value})}
              required
            />
          </div>


          <div>
            <label className="block text-gray-700 font-medium mb-2">Year</label>
            <input
              type="number"
              placeholder="Enter year"
              className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              value={form.year}
              onChange={(e)=>setForm({...form,year:Number(e.target.value)})}
              required
            />
          </div>


          <div>
            <label className="block text-gray-700 font-medium mb-2">Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount"
              className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              value={form.amount}
              onChange={(e)=>setForm({...form,amount:e.target.value})}
              required
            />
          </div>


          <div>
            <label className="block text-gray-700 font-medium mb-2">Payment Mode</label>
            <select
              className="w-full text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              value={form.payment_mode}
              onChange={(e)=>setForm({...form,payment_mode:e.target.value})}
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
            </select>
          </div>



          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md mt-6"
          >
            Record Payment
          </button>

        </form>

      </div>

    </div>

  )

}