const express = require("express")

const router = express.Router()

const reportController = require("../controllers/reportController")

router.get("/monthly", reportController.getMonthlyReport)

router.get("/yearly", reportController.getYearlyReport)

module.exports = router