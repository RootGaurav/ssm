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
  "/pending-records/:flatId",
  authMiddleware,
  adminMiddleware,
  paymentController.getPendingMonthlyRecordsByFlat
)

router.get(
  "/:flatId",
  authMiddleware,
  adminMiddleware,
  paymentController.getPaymentsByFlat
)


router.post(
  "/resident/pay",
  authMiddleware,
  paymentController.paySubscription
)

module.exports = router
