const paymentQueries = require("../db/queries/paymentQueries")

const createOfflinePayment = async (data) => {

  const { flat_id, month, year, amount, payment_mode } = data

  if (!flat_id || !month || !year || !amount) {
    throw new Error("Missing required fields")
  }

  if (!["cash","upi"].includes(payment_mode)) {
    throw new Error("Invalid payment mode")
  }

  return await paymentQueries.createOfflinePayment(data)

}

const getPaymentsByFlat = async (flatId) => {

  if (!flatId) {
    throw new Error("Flat ID required")
  }

  return await paymentQueries.getPaymentsByFlat(flatId)

}

module.exports = {
  createOfflinePayment,
  getPaymentsByFlat
}