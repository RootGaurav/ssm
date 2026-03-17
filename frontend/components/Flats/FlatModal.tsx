"use client"

import { useState, useEffect } from "react"
import { createFlat, updateFlat, getResidents } from "@/services/api"

export default function FlatModal({flat,onClose,onSuccess}:any){

  const [flatNumber,setFlatNumber] = useState(flat?.flat_number || "")
  const [owner,setOwner] = useState(flat?.owner_name || "")
  const [email,setEmail] = useState(flat?.owner_email || "")
  const [phone,setPhone] = useState(flat?.phone || "")
  const [type,setType] = useState(flat?.flat_type || "2BHK")
  const [residents, setResidents] = useState([])
  const [selectedResidentId, setSelectedResidentId] = useState(flat?.user_id ? String(flat.user_id) : "")
  const [error,setError] = useState("")

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const res = await getResidents()
        if(!res.error){
          // Filter residents: include only unassigned or the currently selected
          const filteredResidents = res.filter((r:any) => !r.flat_id || String(r.id) === selectedResidentId)
          setResidents(filteredResidents)
          if(selectedResidentId){
            const resident = filteredResidents.find((r:any) => String(r.id) === selectedResidentId)
            if(resident){
              setOwner(resident.name)
              setEmail(resident.email)
              setPhone(resident.phone)
            }
          }
        } else {
          console.error('Failed to fetch residents:', res.error)
        }
      } catch (e) {
        console.error('Error fetching residents:', e)
      }
    }
    fetchResidents()
  }, [])

  async function handleSubmit(e:any){

    e.preventDefault()

    const data = {

      flat_number:flatNumber,
      owner_name:owner,
      owner_email:email,
      phone,
      flat_type:type,
      user_id: selectedResidentId || null

    }
    let res;

    if(flat){

      res=await updateFlat(flat.id,data)

    }else{

     res = await createFlat(data)

    }
    if(res.error){

      setError(res.error)
      return

    }
    

    onSuccess()
    onClose()

  }

  return(

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">

          {flat ? "Edit Flat" : "Add Flat"}

        </h2>
        {error && (
  <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
    {error}
  </div>
)}

        <p className="text-gray-600 text-center mb-6">
          {flat ? "Update flat details" : "Enter new flat information"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Flat Number"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={flatNumber}
            onChange={(e)=>setFlatNumber(e.target.value)}
            required
          />

          <select
            className="w-full text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={selectedResidentId}
            onChange={(e) => {
              const id = e.target.value
              setSelectedResidentId(id)
              if(id){
                const resident = residents.find((r:any) => String(r.id) === id) as any
                if(resident){
                  setOwner(resident.name)
                  setEmail(resident.email)
                  setPhone(resident.phone)
                }
              } else {
                setOwner('')
                setEmail('')
                setPhone('')
              }
            }}
          >
            <option value="">No Resident (Vacant)</option>
            {residents.map((r:any) => <option key={r.id} value={String(r.id)}>{r.name} ({r.email})</option>)}
          </select>

          <input
            placeholder="Owner Name"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={owner}
            onChange={(e)=>setOwner(e.target.value)}
          />

          <input
            type="email"
            placeholder="Owner Email"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            placeholder="Phone Number"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
          />

          <select
            className="w-full text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={type}
            onChange={(e)=>setType(e.target.value)}
            required
          >
            <option value="2BHK">2BHK</option>
            <option value="3BHK">3BHK</option>
          </select>

          <div className="flex justify-end gap-3 mt-6">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md"
            >
              {flat ? "Update" : "Add"} Flat
            </button>

          </div>

        </form>

      </div>

    </div>

  )

}
