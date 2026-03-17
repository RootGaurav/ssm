const reportQueries = require("../db/queries/reportQueries")

const getMonthlyReport = async () => {
  return await reportQueries.getMonthlyReport()
}

const getYearlyReport = async () => {
  return await reportQueries.getYearlyReport()
}

module.exports = {
  getMonthlyReport,
  getYearlyReport
}