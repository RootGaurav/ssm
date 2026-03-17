const queries = require("../db/queries/dashboardQueries")

const getDashboardStats = async () => {

  const flats = await queries.getTotalFlats()
  const occupied = await queries.getOccupiedFlats()
  const collection = await queries.getTotalCollection()
  const pending = await queries.getPendingPayments()
  const trend = await queries.getMonthlyTrend()

  return {
    totalFlats: flats.total_flats,
    occupiedFlats: occupied.occupied_flats,
    totalCollection: collection.total_collection,
    pendingPayments: pending.pending_count,
    pendingAmount: pending.pending_amount,
    monthlyTrend: trend
  }

}

module.exports = {
  getDashboardStats
}