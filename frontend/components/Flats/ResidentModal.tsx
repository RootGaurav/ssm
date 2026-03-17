"use client"

import { useState, useEffect } from "react"
import { createResident, getFlats } from "@/services/api"

export default function ResidentModal({ onClose, onSuccess }: any) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [flatId, setFlatId] = useState("")
  const [flats, setFlats] = useState<any[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFlats()
  }, [])

  async function loadFlats() {
    const data = await getFlats()
    if (Array.isArray(data)) setFlats(data.filter(f => !f.owner_name))
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    if (!flatId) {
      setError("Please select a flat")
      return
    }
    if (!name || !email || !password || !phone) {
      setError("Please fill in all fields")
      return
    }
    setLoading(true)
    setError("")
    try {
      const data = {
        name,
        email,
        password,
        phone,
        flat_id: parseInt(flatId)
      }
      const response = await createResident(data)
      if (response.error) {
        setError(response.error)
        return
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Error creating resident:", err)
      setError(err.message || "Failed to create resident")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Add Resident
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Create a new resident and assign to an available flat.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Resident Name"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Resident Email"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="w-full text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={flatId}
            onChange={(e) => setFlatId(e.target.value)}
            required
          >
            <option value="">Select Flat</option>
            {flats.map(flat => (
              <option key={flat.id} value={flat.id}>
                {flat.flat_number} - {flat.flat_type}
              </option>
            ))}
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
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md"
            >
              {loading ? "Adding..." : "Add Resident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}