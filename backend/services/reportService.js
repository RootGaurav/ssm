const reportQueries = require("../db/queries/reportQueries")

const getMonthlyReport = async () => {
  return await reportQueries.getMonthlyReport()
}

const getYearlyReport = async () => {
  return await reportQueries.getYearlyReport()
}

const getPendingPayments = async () => {
  return await reportQueries.getPendingPayments()
}

module.exports = {
  getMonthlyReport,
  getYearlyReport,
  getPendingPayments
}