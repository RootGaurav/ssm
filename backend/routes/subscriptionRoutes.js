const express = require("express")
const router = express.Router()

const controller = require("../controllers/subscriptionController")

const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")


// GET ALL PLANS
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  controller.getAllPlans
)


// UPDATE PLAN
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  controller.updatePlan
)


module.exports = router