const express = require("express")
const router = express.Router()

const controller = require("../controllers/profileController")

const authMiddleware = require("../middleware/authMiddleware")

const adminMiddleware = require("../middleware/adminMiddleware")

router.get("/", authMiddleware,adminMiddleware, controller.getProfile)

router.put("/", authMiddleware, adminMiddleware, controller.updateProfile)

router.put("/password", authMiddleware, adminMiddleware, controller.changePassword)
module.exports = router