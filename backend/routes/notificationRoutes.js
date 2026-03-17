const express = require("express")
const router = express.Router()

const controller = require("../controllers/notificationController")

const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  controller.getNotifications
)

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  controller.createNotification
)

module.exports = router