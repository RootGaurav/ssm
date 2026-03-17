export default function DeleteConfirmModal({isOpen,onClose,onConfirm}:any){

  if(!isOpen) return null

  return(

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200">

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Delete Flat
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete this flat? This action cannot be undone.
        </p>

        <div className="flex justify-center gap-4">

          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Delete
          </button>

        </div>

      </div>

    </div>

  )
}