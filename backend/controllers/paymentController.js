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





//residents



const paySubscription = async (req,res)=>{

  try{

    const {month,year} = req.body

    const result = await paymentService.paySubscription(
      req.user.id,
      month,
      year
    )

    res.json(result)

  }catch(error){

    let userMessage = "Payment processing failed. Please try again."

    if(error.message && error.message.includes("User not assigned")){
      userMessage = error.message
    } else if(error.message && error.message.includes("Monthly record")){
      userMessage = error.message
    }

    res.status(400).json({
      error: userMessage
    })

  }

}


module.exports = {
  createOfflinePayment,
  getPaymentsByFlat,
  paySubscription
}