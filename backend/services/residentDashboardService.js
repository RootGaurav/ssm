const queries = require("../db/queries/residentDashboardQueries")
const pool = require("../db/db")


const getResidentDashboard = async (userId) => {

  // GET USER FLAT
  const userResult = await pool.query(
    `SELECT flat_id FROM users WHERE id=$1`,
    [userId]
  )

  const flatId = userResult.rows[0]?.flat_id

  if(!flatId){
    throw new Error("Resident not assigned to a flat")
  }

  const status = await queries.getCurrentMonthStatus(flatId)
  const pending = await queries.getPendingAmount(flatId)
  const payments = await queries.getRecentPayments(flatId)
  const notifications = await queries.getNotifications(flatId,userId)

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