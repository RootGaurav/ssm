const paymentQueries = require("../db/queries/paymentQueries")

const createOfflinePayment = async (data) => {
  return await paymentQueries.createOfflinePayment(data)
}

const getPaymentsByFlat = async (flatId) => {
  return await paymentQueries.getPaymentsByFlat(flatId)
}

module.exports = {
  createOfflinePayment,
  getPaymentsByFlat
}