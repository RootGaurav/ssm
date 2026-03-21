"use client"

import { useEffect, useState } from "react"
import {
  getSubscriptionPlans,
  updateSubscriptionPlan
} from "@/services/api"

export default function SubscriptionsPage() {

  const [plans,setPlans] = useState<any[]>([])
  const [values,setValues] = useState<any>({})
  const [loading,setLoading] = useState(true)



  async function loadPlans(){

    const data = await getSubscriptionPlans()

    if(Array.isArray(data)){

      setPlans(data)

      const initialValues:any = {}

      data.forEach((p:any)=>{
        initialValues[p.id] = p.monthly_amount
      })

      setValues(initialValues)

    }

    setLoading(false)

  }



  useEffect(()=>{
    loadPlans()
  },[])



  function handleChange(id:number,value:number){

    setValues((prev:any)=>({
      ...prev,
      [id]: value
    }))

  }



  async function handleUpdate(id:number){

    const amount = values[id]

    if(!amount || amount <= 0){
      alert("Invalid amount")
      return
    }

    await updateSubscriptionPlan(id,amount)

    loadPlans()

  }



  if(loading){
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    )
  }



  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Subscription Plans
        </h1>

        <p className="text-gray-600 mb-8">
          Manage monthly maintenance charges for each flat type
        </p>
        <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">

    <thead className="bg-gray-100 hidden sm:table-header-group">
      <tr>
        <th className="p-4 text-left font-semibold text-gray-700">
          Flat Type
        </th>
        <th className="p-4 text-left font-semibold text-gray-700">
          Monthly Amount
        </th>
        <th className="p-4 text-left font-semibold text-gray-700">
          Action
        </th>
      </tr>
    </thead>

    <tbody>
      {plans.map((plan: any) => (
        <tr
          key={plan.id}
          className="border-t border-gray-200 flex flex-col sm:table-row p-4 sm:p-0 gap-3 sm:gap-0"
        >
          {/* Flat Type */}
          <td className="font-semibold text-gray-700 sm:p-4">
            <span className="sm:hidden text-gray-500 text-sm">
              Flat Type:{" "}
            </span>
            {plan.flat_type}
          </td>

          {/* Amount */}
          <td className="sm:p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-600">₹</span>

              <input
                type="number"
                value={values[plan.id] || ""}
                onChange={(e) =>
                  handleChange(plan.id, Number(e.target.value))
                }
                className="w-full sm:w-32 text-black border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <span className="text-gray-500 text-sm">/month</span>
            </div>
          </td>

          {/* Button */}
          <td className="sm:p-4">
            <button
              onClick={() => handleUpdate(plan.id)}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
            >
              Update
            </button>
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