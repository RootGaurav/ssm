const express = require("express")
const router = express.Router()

const controller = require("../controllers/monthlyRecordController")

const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")


router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  controller.getMonthlyRecords
)

router.post(
  "/generate",
  authMiddleware,
  adminMiddleware,
  controller.generateMonthlyRecords
)

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  controller.updateMonthlyRecord
)

module.exports = router