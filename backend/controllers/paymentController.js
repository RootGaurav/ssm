const paymentService = require("../services/paymentService")

// CREATE OFFLINE PAYMENT
const createOfflinePayment = async (req, res) => {

  try {

    const payment = await paymentService.createOfflinePayment(req.body)

    res.status(201).json(payment)

  } catch (error) {

    let userMessage = "Failed to record payment"

    if (error.message && error.message.includes("unique_payment")) {
      userMessage = "Payment for this flat, month, and year already exists. Please check the records."
    } else if (error.message && error.message.includes("violates unique constraint")) {
      userMessage = "Payment for this flat, month, and year already exists. Please check the records."
    } else if (error.message) {
      userMessage = error.message
    }

    res.status(400).json({
      error: userMessage
    })

  }

}


// GET PAYMENTS
const getPaymentsByFlat = async (req, res) => {

  try {

    const payments = await paymentService.getPaymentsByFlat(
      req.params.flatId
    )

    res.json(payments)

  } catch (error) {

    res.status(400).json({
      error: error.message
    })

  }

}

module.exports = {
  createOfflinePayment,
  getPaymentsByFlat
}