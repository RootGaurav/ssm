const express = require("express")
const router = express.Router()

const controller = require("../controllers/residentSubscriptionController")
const authMiddleware = require("../middleware/authMiddleware")

router.get(
  "/",
  authMiddleware,
  controller.getSubscriptions
)

router.get(
  "/:year/:month",
  authMiddleware,
  controller.getSubscriptionDetail
)

module.exports = router