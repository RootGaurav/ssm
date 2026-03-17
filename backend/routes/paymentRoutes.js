const express = require("express")
const router = express.Router()

const paymentController = require("../controllers/paymentController")

const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

router.post(
  "/offline",
  authMiddleware,
  adminMiddleware,
  paymentController.createOfflinePayment
)

router.get(
  "/:flatId",
  authMiddleware,
  adminMiddleware,
  paymentController.getPaymentsByFlat
)

module.exports = router