const express = require("express")

const router = express.Router()

const reportController = require("../controllers/reportController")

const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

router.get(
  "/monthly",
  authMiddleware,
  adminMiddleware,
  reportController.getMonthlyReport
)

router.get(
  "/yearly",
  authMiddleware,
  adminMiddleware,
  reportController.getYearlyReport
)

router.get(
  "/pending",
  authMiddleware,
  adminMiddleware,
  reportController.getPendingPayments
)

module.exports = router