const dashboardQueries = require("../db/queries/dashboardQueries")

const getAdminDashboardStats = async () => {
  return await dashboardQueries.getAdminDashboardStats()
}

module.exports = {
  getAdminDashboardStats
}