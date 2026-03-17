const express = require("express")

const router = express.Router()

const paymentController = require("../controllers/paymentController")

router.post("/offline", paymentController.createOfflinePayment)

router.get("/:flatId", paymentController.getPaymentsByFlat)

module.exports = router