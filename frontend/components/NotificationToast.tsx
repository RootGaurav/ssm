"use client"

export default function NotificationToast({ notification, onClose }: any) {
  if (!notification) return null

  return (
    <div className="fixed top-5 right-5 bg-white shadow-lg rounded-xl p-4 w-80 border z-50">
      <h3 className="font-semibold">{notification.title}</h3>
      <p className="text-sm text-gray-600">{notification.message}</p>

      <button
        onClick={onClose}
        className="mt-2 text-blue-500 text-sm"
      >
        Close
      </button>
    </div>
  )
}