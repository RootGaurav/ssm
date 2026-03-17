const express = require("express")
const router = express.Router()

const controller = require("../controllers/profileController")

const authMiddleware = require("../middleware/authMiddleware")

// Resident profile routes (no admin middleware)
router.get("/", authMiddleware, controller.getProfile)
router.put("/", authMiddleware, controller.updateProfile)
router.put("/password", authMiddleware, controller.changePassword)

module.exports = router
