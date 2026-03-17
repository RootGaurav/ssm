const express = require("express")

const router = express.Router()

const monthlyController = require("../controllers/monthlyRecordController")

router.get("/", monthlyController.getMonthlyRecords)

router.post("/", monthlyController.createMonthlyRecord)

router.put("/:id", monthlyController.updateMonthlyRecord)

module.exports = router