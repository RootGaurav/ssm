const express = require("express")
const router = express.Router()

const residentDashboardController = require("../controllers/residentDashboardController")

const authMiddleware = require("../middleware/authMiddleware")

router.get(
  "/",
  authMiddleware,
  residentDashboardController.getDashboard
)

module.exports = router