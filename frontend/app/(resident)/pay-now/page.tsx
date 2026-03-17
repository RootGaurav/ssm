"use client"

import { useEffect, useState } from "react"
import { getSubscriptions, paySubscription, getRazorpayKey } from "@/services/api"

interface PaymentData {
  month: number
  year: number
  amount: number
  flat_number: string
  flat_type: string
}

interface ReceiptData {
  userName: string
  userEmail: string
  flatNumber: string
  flatType: string
  amount: number
  month: number
  year: number
  transactionId: string
}

export default function PayNow() {
  const [pending, setPending] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)

  async function load() {
    const data = await getSubscriptions()
    const onlyPending = data.filter((s: any) => s.status === "pending")
    setPending(onlyPending)
  }

  useEffect(() => {
    load()
  }, [])

  const handlePayClick = (payment: any) => {
    setSelectedPayment(payment)
    setShowModal(true)
  }

  const handleConfirmPayment = async () => {
    if (!selectedPayment) return

    setLoading(true)
    setErrorMessage("")

    try {
      const result = await paySubscription(selectedPayment.month, selectedPayment.year)

      if (result.success) {
        setReceiptData(result)
        setShowReceipt(true)
        setSuccessMessage(
          `Payment of ₹${result.amount} for ${result.month}/${result.year} is successful!`
        )
        setShowModal(false)
        setTimeout(() => {
          window.location.reload()
        }, 8000)
      } else {
        setErrorMessage(result.error || "Payment failed. Please try again.")
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred. Please try again.")
    }

    setLoading(false)
  }

  const downloadReceipt = () => {
    if (!receiptData) return

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .receipt { max-width: 600px; border: 2px solid #ddd; padding: 30px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #2563eb; margin: 0 0 10px 0; }
          .section { margin-bottom: 25px; }
          .label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
          .value { font-size: 18px; font-weight: bold; color: #333; margin-top: 5px; }
          .amount-section { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
          .amount-section .label { color: #666; }
          .amount-section .value { font-size: 32px; color: #2563eb; }
          .footer { text-align: center; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; color: #666; font-size: 12px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 15px; }
          .col { flex: 1; }
          .success-badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>💳 Payment Receipt</h1>
            <div class="success-badge">✓ Payment Successful</div>
          </div>
          
          <div class="section">
            <div class="row">
              <div class="col">
                <div class="label">Resident Name</div>
                <div class="value">${receiptData.userName}</div>
              </div>
              <div class="col">
                <div class="label">Email</div>
                <div class="value">${receiptData.userEmail}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="row">
              <div class="col">
                <div class="label">Flat Number</div>
                <div class="value">${receiptData.flatNumber}</div>
              </div>
              <div class="col">
                <div class="label">Flat Type</div>
                <div class="value">${receiptData.flatType}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="row">
              <div class="col">
                <div class="label">Billing Period</div>
                <div class="value">${receiptData.month}/${receiptData.year}</div>
              </div>
              <div class="col">
                <div class="label">Transaction ID</div>
                <div class="value" style="font-size: 14px;">${receiptData.transactionId}</div>
              </div>
            </div>
          </div>

          <div class="amount-section">
            <div class="label">Amount Paid</div>
            <div class="value">₹${receiptData.amount}</div>
          </div>

          <div class="footer">
            <p>This is an automatically generated receipt. No signature is required.</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Thank you for your payment!</p>
          </div>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([receiptHTML], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `receipt-${receiptData.month}-${receiptData.year}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  if (pending.length === 0 && !showReceipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">No Pending Payments 🎉</h1>
            <p className="text-gray-600">All your subscriptions are up to date. Great job!</p>
          </div>
        </div>
      </div>
    )
  }

  if (showReceipt && receiptData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful! ✓</h1>
            <p className="text-gray-600 mb-8">Your payment has been processed successfully.</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">RESIDENT NAME</p>
                <p className="text-gray-800 text-lg font-bold">{receiptData.userName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">EMAIL</p>
                <p className="text-gray-800 text-lg">{receiptData.userEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">FLAT NUMBER</p>
                <p className="text-gray-800 text-lg font-bold">{receiptData.flatNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">FLAT TYPE</p>
                <p className="text-gray-800 text-lg">{receiptData.flatType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">BILLING PERIOD</p>
                <p className="text-gray-800 text-lg font-bold">{receiptData.month}/{receiptData.year}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">TRANSACTION ID</p>
                <p className="text-gray-800 text-lg font-mono">{receiptData.transactionId}</p>
              </div>
            </div>

            <div className="border-t-2 border-gray-300 pt-6">
              <p className="text-gray-600 text-sm font-semibold mb-2">AMOUNT PAID</p>
              <p className="text-4xl font-bold text-green-600">₹{receiptData.amount}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={downloadReceipt}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Receipt
            </button>
            <button
              onClick={() => {
                setShowReceipt(false)
                load()
              }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Back to Payments
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Pay Subscription</h1>
              <p className="text-gray-600">Pay your pending monthly subscriptions</p>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Flat Number</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Flat Type</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Month</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Year</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Amount</th>
                <th className="px-6 py-4 text-center text-gray-700 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {pending.map((p: any, i: number) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                  <td className="px-6 py-4 text-gray-800 font-medium">{p.flat_number}</td>
                  <td className="px-6 py-4 text-gray-800">{p.flat_type}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{p.month}</td>
                  <td className="px-6 py-4 text-gray-800">{p.year}</td>
                  <td className="px-6 py-4 text-gray-800 font-semibold text-lg">₹{p.amount}</td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handlePayClick(p)}
                      disabled={loading}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pay Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Payment</h2>
              <p className="text-gray-600">Please verify the payment details before proceeding</p>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Flat Number</span>
                <span className="font-semibold text-gray-800">{selectedPayment.flat_number}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Flat Type</span>
                <span className="font-semibold text-gray-800">{selectedPayment.flat_type}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Billing Period</span>
                <span className="font-semibold text-gray-800">{selectedPayment.month}/{selectedPayment.year}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600 font-semibold">Amount to Pay</span>
                <span className="text-2xl font-bold text-green-600">₹{selectedPayment.amount}</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Payment
                  </>
                )}
              </button>
            </div>

            {/* Security Note */}
            <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Payment Processing
            </p>
          </div>
        </div>
      )}
    </div>
  )
}