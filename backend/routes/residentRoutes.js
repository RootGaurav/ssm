const express = require("express")
const router = express.Router()

const residentController = require("../controllers/residentController")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

// GET ALL RESIDENTS
router.get("/", authMiddleware, adminMiddleware, residentController.getResidents)

// CREATE RESIDENT
router.post("/", authMiddleware, adminMiddleware, residentController.createResident)

// UPDATE RESIDENT
router.put("/:id", authMiddleware, adminMiddleware, residentController.updateResident)

// DELETE RESIDENT
router.delete("/:id", authMiddleware, adminMiddleware, residentController.deleteResident)

// ASSIGN RESIDENT TO FLAT
router.post("/assign", authMiddleware, adminMiddleware, residentController.assignResidentToFlat)

// VACATE FLAT
router.post("/vacate/:flatId", authMiddleware, adminMiddleware, residentController.vacateFlat)

module.exports = router