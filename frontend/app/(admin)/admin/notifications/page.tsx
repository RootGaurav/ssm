"use client"

import { useEffect, useState } from "react"
import {
  getNotifications,
  createNotification,
  getFlats,
  getResidents
} from "@/services/api"

export default function NotificationsPage(){

  const [notifications,setNotifications] = useState<any[]>([])
  const [flats,setFlats] = useState<any[]>([])
  const [residents,setResidents] = useState<any[]>([])

  const [targetType,setTargetType] = useState("all")

  const [form,setForm] = useState({
    title:"",
    message:"",
    flat_id:"",
    user_id:""
  })

  const [success,setSuccess] = useState(false)
  const [error,setError] = useState("")



  async function loadData(){

    const notifications = await getNotifications()
    const flats = await getFlats()
    const residents = await getResidents()

    if(Array.isArray(notifications)) setNotifications(notifications)
    if(Array.isArray(flats)) setFlats(flats)
    if(Array.isArray(residents)) setResidents(residents)

  }

  useEffect(()=>{
    loadData()
  },[])



  async function handleSubmit(e:any){

    e.preventDefault()

    const result = await createNotification({
      title:form.title,
      message:form.message,
      target_type:targetType,
      flat_id:form.flat_id || null,
      user_id:form.user_id || null
    })

    if(result.error){
      setError(result.error)
      setTimeout(()=>setError(""),4000)
      return
    }

    setSuccess(true)
    setTimeout(()=>setSuccess(false),4000)

    setForm({
      title:"",
      message:"",
      flat_id:"",
      user_id:""
    })

    loadData()

  }



  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="max-w-5xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Notifications
        </h1>



        {success && (
          <div className="bg-green-500 text-white p-3 rounded">
            Notification sent successfully
          </div>
        )}

        {error && (
          <div className="bg-red-500 text-white p-3 rounded">
            {error}
          </div>
        )}



        {/* SEND NOTIFICATION */}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >

          <select
            value={targetType}
            onChange={(e)=>setTargetType(e.target.value)}
            className="w-full border p-3 rounded text-black"
          >
            <option value="all">Send to All Residents</option>
            <option value="flat">Send to Specific Flat</option>
            <option value="resident">Send to Specific Resident</option>
          </select>



          {targetType === "flat" && (

            <select
              value={form.flat_id}
              onChange={(e)=>setForm({...form,flat_id:e.target.value})}
              className="w-full border p-3 rounded text-black"
            >
              <option value="">Select Flat</option>

              {flats.map((f:any)=>(
                <option key={f.id} value={f.id}>
                  {f.flat_number}
                </option>
              ))}

            </select>

          )}



          {targetType === "resident" && (

            <select
              value={form.user_id}
              onChange={(e)=>setForm({...form,user_id:e.target.value})}
              className="w-full border p-3 rounded text-black"
            >
              <option value="">Select Resident</option>

              {residents.map((r:any)=>(
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}

            </select>

          )}



          <input
            type="text"
            placeholder="Title"
            className="w-full border p-3 rounded text-black"
            value={form.title}
            onChange={(e)=>setForm({...form,title:e.target.value})}
            required
          />



          <textarea
            placeholder="Message"
            rows={4}
            className="w-full border p-3 rounded text-black"
            value={form.message}
            onChange={(e)=>setForm({...form,message:e.target.value})}
            required
          />



          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Send Notification
          </button>

        </form>



        {/* HISTORY */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl text-gray-800 font-semibold mb-4">
            Notification History
          </h2>

          {notifications.map((n:any)=>(

            <div
              key={n.id}
              className="border border-gray-200 rounded-lg p-4 mb-3"
            >

              <h3 className="font-semibold text-gray-800">
                {n.title}
              </h3>

              <p className="text-gray-600 mt-1">
                {n.message}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                {new Date(n.created_at).toLocaleString()}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}