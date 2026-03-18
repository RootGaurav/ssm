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

  if(flatIds.length === 0){
    throw new Error("Resident not assigned to a flat")
  }

  const status = await queries.getCurrentMonthStatus(flatIds)
  const pending = await queries.getPendingAmount(flatIds)
  const payments = await queries.getRecentPayments(flatIds)
  const notifications = await queries.getNotifications(flatIds,userId)

  return {
    currentMonth: status,
    pendingAmount: pending.pending_amount,
    recentPayments: payments,
    notifications
  }

}

module.exports = {
  getResidentDashboard
}
