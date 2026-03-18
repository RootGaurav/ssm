"use client"

import { useState, useEffect } from "react"
import { getResidents, assignResidentToFlat } from "@/services/api"

export default function AssignModal({ flatId, onClose, onSuccess }: any) {
  const [residents, setResidents] = useState<any[]>([])
  const [selectedResidentId, setSelectedResidentId] = useState("")

  useEffect(() => {
    loadResidents()
  }, [])

  async function loadResidents() {
    const data = await getResidents()
    if (Array.isArray(data)) setResidents(data)
  }

  async function handleAssign() {
    if (!selectedResidentId) return
    await assignResidentToFlat(parseInt(selectedResidentId), flatId)
    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Assign Resident to Flat
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Select a resident to assign to this flat.
        </p>

        <select
          className="w-full text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 mb-4"
          value={selectedResidentId}
          onChange={(e) => setSelectedResidentId(e.target.value)}
        >
          <option value="">Select Resident</option>
          {residents.map(resident => (
            <option key={resident.id} value={resident.id}>
              {resident.name} - {resident.email}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  )
}
