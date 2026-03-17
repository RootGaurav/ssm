const dashboardService = require("../services/dashboardService")

const getAdminDashboardStats = async (req, res) => {

  try {

    const stats = await dashboardService.getAdminDashboardStats()

    res.json(stats)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: "Failed to fetch dashboard stats"
    })

  }

}

module.exports = {
  getAdminDashboardStats
}