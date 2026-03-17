const reportService = require("../services/reportService")

const getMonthlyReport = async (req, res) => {

  try {

    const report = await reportService.getMonthlyReport()

    res.json(report)

  } catch (error) {

    res.status(500).json({
      error: "Failed to generate monthly report"
    })

  }

}


const getYearlyReport = async (req, res) => {

  try {

    const report = await reportService.getYearlyReport()

    res.json(report)

  } catch (error) {

    res.status(500).json({
      error: "Failed to generate yearly report"
    })

  }

}


const getPendingPayments = async (req,res)=>{

  try{

    const data = await reportService.getPendingPayments()

    res.json(data)

  }catch(error){

    res.status(500).json({
      error:"Failed to fetch pending payments"
    })

  }

}

module.exports = {
  getMonthlyReport,
  getYearlyReport,
  getPendingPayments
}