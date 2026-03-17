const express = require("express")
const router = express.Router()

const controller = require("../controllers/dashboardController")

const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  controller.getDashboardStats
)

module.exports = router