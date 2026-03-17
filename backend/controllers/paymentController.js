const paymentService = require("../services/paymentService")

// CREATE OFFLINE PAYMENT
const createOfflinePayment = async (req, res) => {

  try {

    const payment = await paymentService.createOfflinePayment(req.body)

    res.status(201).json(payment)

  } catch (error) {

    res.status(500).json({
      error: "Failed to record payment"
    })

  }

}


// GET PAYMENTS
const getPaymentsByFlat = async (req, res) => {

  try {

    const payments = await paymentService.getPaymentsByFlat(req.params.flatId)

    res.json(payments)

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch payments"
    })

  }

}

module.exports = {
  createOfflinePayment,
  getPaymentsByFlat
}