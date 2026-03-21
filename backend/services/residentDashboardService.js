const queries = require("../db/queries/residentDashboardQueries")
const pool = require("../db/db")


const getResidentDashboard = async (userId) => {

  // GET USER FLATS
  const flatsResult = await pool.query(
    `
    SELECT id AS flat_id
    FROM flats
    WHERE user_id = $1
      AND is_deleted = false
    ORDER BY id
    `,
    [userId]
  )

  const flatIds = flatsResult.rows.map((row) => row.flat_id)

  if (flatIds.length === 0) {
    const notifications = await queries.getNotifications([], userId)

    return {
      hasAssignedFlat: false,
      message: "No flat is currently assigned to your account.",
      currentMonth: null,
      pendingAmount: 0,
      recentPayments: [],
      notifications
    }
  }

  const status = await queries.getCurrentMonthStatus(userId)
  const pending = await queries.getPendingAmount(userId)
  const payments = await queries.getRecentPayments(userId)
  const notifications = await queries.getNotifications(flatIds,userId)

  return {
    hasAssignedFlat: true,
    currentMonth: status,
    pendingAmount: pending.pending_amount,
    recentPayments: payments,
    notifications
  }

}

module.exports = {
  getResidentDashboard
}
