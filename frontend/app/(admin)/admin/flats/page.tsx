"use client"

import { useEffect, useState } from "react"
import { getFlats, deleteFlat, vacateFlat } from "@/services/api"
import FlatsTable from "@/components/Flats/FlatsTable"
import FlatModal from "@/components/Flats/FlatModal"
import AssignModal from "@/components/Flats/AssignModal"
import ResidentModal from "@/components/Flats/ResidentModal"
import DeleteConfirmModal from "@/components/Flats/DeleteConfirmModal"

export default function FlatsPage() {

  const [flats,setFlats] = useState<any[]>([])
  const [search,setSearch] = useState("")
  const [showModal,setShowModal] = useState(false)
  const [selectedFlat,setSelectedFlat] = useState(null)
  const [deleteId,setDeleteId] = useState<number | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [assignFlat, setAssignFlat] = useState<any>(null)
  const [showResidentModal, setShowResidentModal] = useState(false)
  const [residentFlat, setResidentFlat] = useState(null)

  async function loadFlats(){
    const data = await getFlats()
    if(Array.isArray(data)) setFlats(data)
  }

  useEffect(()=>{
    loadFlats()
  },[])

  const filteredFlats = flats.filter((flat:any)=>
    flat.flat_number.toLowerCase().includes(search.toLowerCase())
  )

  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-6xl mx-auto">

        <div className="flex justify-between mb-8">

          <div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Flats Management
            </h1>

            <p className="text-gray-600">
              Manage society flats and residents
            </p>

          </div>

          <button
            onClick={()=>{
              setResidentFlat(null)
              setShowResidentModal(true)
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Add Resident
          </button>

        </div>

        <input
          placeholder="Search flats by number..."
          className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 mb-6"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <FlatsTable
          flats={filteredFlats}
          onEdit={(flat:any)=>{
            setSelectedFlat(flat)
            setShowModal(true)
          }}
          onVacate={async (id:number)=>{
            await vacateFlat(id)
            loadFlats()
          }}
          onAssign={(flat:any)=>{
            setAssignFlat(flat)
            setShowAssignModal(true)
          }}
          onDelete={(id:number)=>{
            setDeleteId(id)
          }}
        />

        {showModal && (
          <FlatModal
            flat={selectedFlat}
            onClose={()=>setShowModal(false)}
            onSuccess={()=>{
              loadFlats()
              setShowModal(false)
            }}
          />
        )}

        <DeleteConfirmModal
          isOpen={deleteId !== null}
          onClose={()=>setDeleteId(null)}
          onConfirm={async ()=>{
            if(deleteId){
              await deleteFlat(deleteId)
              setDeleteId(null)
              loadFlats()
            }
          }}
        />

        {showAssignModal && (
          <AssignModal
            flatId={assignFlat?.id}
            onClose={()=>setShowAssignModal(false)}
            onSuccess={()=>{
              loadFlats()
              setShowAssignModal(false)
            }}
          />
        )}

        {showResidentModal && (
          <ResidentModal
            onClose={()=>setShowResidentModal(false)}
            onSuccess={()=>{
              loadFlats()
              setShowResidentModal(false)
            }}
          />
        )}

      </div>

    </div>

  )
}