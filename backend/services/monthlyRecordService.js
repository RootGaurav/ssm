const queries = require("../db/queries/monthlyRecordQueries")

const getMonthlyRecords = async (month, year) => {

  if (!month || !year) {
    throw new Error("Month and year required")
  }

  return await queries.getMonthlyRecords(month, year)
}

const generateMonthlyRecords = async (month, year) => {

  if (!month || !year) {
    throw new Error("Month and year required")
  }

  return await queries.generateMonthlyRecords(month, year)
}

const updateMonthlyRecord = async (id, status) => {

  if (!["pending","paid"].includes(status)) {
    throw new Error("Invalid status")
  }

  return await queries.updateMonthlyRecord(id, status)
}

module.exports = {
  getMonthlyRecords,
  generateMonthlyRecords,
  updateMonthlyRecord
}