"use client"

import { useState } from "react"
export default function FlatsTable({flats,onEdit,onVacate,onAssign,onDelete}:any){
  const [sortField,setSortField] = useState("flat_number")
  const [sortOrder,setSortOrder] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5) // Items per page

  function handleSort(field:string){
    if(field === sortField){
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }else{
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const sortedFlats = [...flats].sort((a,b)=>{
    const valueA = a[sortField]
    const valueB = b[sortField]
    if(valueA < valueB) return sortOrder === "asc" ? -1 : 1
    if(valueA > valueB) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedFlats.length / pageSize)
  const paginatedFlats = sortedFlats.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return(
    <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
      <table className="w-full border-collapse">
        <thead className="bg-green-50">
          <tr>
            <th className="p-4 border-b border-gray-300 text-left text-gray-800 font-semibold cursor-pointer hover:bg-green-100" onClick={() => handleSort("flat_number")}>
              Flat Number {sortField === "flat_number" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-4 border-b border-gray-300 text-left text-gray-800 font-semibold cursor-pointer hover:bg-green-100" onClick={() => handleSort("owner_name")}>
              Owner {sortField === "owner_name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-4 border-b border-gray-300 text-left text-gray-800 font-semibold cursor-pointer hover:bg-green-100" onClick={() => handleSort("owner_email")}>
              Email {sortField === "owner_email" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-4 border-b border-gray-300 text-left text-gray-800 font-semibold cursor-pointer hover:bg-green-100" onClick={() => handleSort("phone")}>
              Phone {sortField === "phone" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-4 border-b border-gray-300 text-left text-gray-800 font-semibold cursor-pointer hover:bg-green-100" onClick={() => handleSort("status")}>
              Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-4 border-b border-gray-300 text-left text-gray-800 font-semibold cursor-pointer hover:bg-green-100" onClick={() => handleSort("flat_type")}>
              Type {sortField === "flat_type" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-4 border-b border-gray-300 text-left text-gray-800 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedFlats.map((flat:any, index:number)=>(
            <tr key={flat.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
              <td className="border-b border-gray-200 p-4 text-gray-900">{flat.flat_number}</td>
              <td className="border-b border-gray-200 p-4 text-gray-900">{flat.owner_name}</td>
              <td className="border-b border-gray-200 p-4 text-gray-900">{flat.owner_email}</td>
              <td className="border-b border-gray-200 p-4 text-gray-900">{flat.phone}</td>
                
                
                {/* <td className="border-b border-gray-200 p-4 text-gray-900">{flat.status}</td> */}

                <td className="border-b border-gray-200 p-4 text-gray-900 ">

                {flat.status === "vacant" ? (

                <span className="border-b border-gray-200 p-4  text-yellow-900 ">
                Vacant
                </span>

                ) : (

                <span className="border-b border-gray-200 p-4  text-green-900">
                Occupied
                </span>

                )}
                </td>
              
              <td className="border-b border-gray-200 p-4 text-gray-900">{flat.flat_type}</td>
              <td className="border-b border-gray-200 p-4">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={()=>onEdit(flat)}
                    className="text-green-600 hover:text-green-800 font-medium transition"
                  >
                    Edit
                  </button>
                  {flat.status==="occupied" && (
                    <button
                      onClick={()=>onVacate(flat.id)}
                      className="text-orange-600 hover:text-orange-800 font-medium transition"
                    >
                      Vacate
                    </button>
                  )}
                  {flat.status==="vacant" && (
                    <button
                      onClick={()=>onAssign(flat)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      Assign
                    </button>
                  )}
                  <button
                    onClick={()=>onDelete(flat.id)}
                    className="text-red-600 hover:text-red-800 font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-gray-600">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedFlats.length)} of {sortedFlats.length} entries
        </div>
        <div className="flex gap-2 text-gray-600">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3   py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}