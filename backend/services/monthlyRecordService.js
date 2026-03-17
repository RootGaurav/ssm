const monthlyQueries = require("../db/queries/monthlyRecordQueries")

const getMonthlyRecords = async () => {
  return await monthlyQueries.getMonthlyRecords()
}

const createMonthlyRecord = async (data) => {
  return await monthlyQueries.createMonthlyRecord(data)
}

const updateMonthlyRecord = async (id, status) => {
  return await monthlyQueries.updateMonthlyRecord(id, status)
}

module.exports = {
  getMonthlyRecords,
  createMonthlyRecord,
  updateMonthlyRecord
}