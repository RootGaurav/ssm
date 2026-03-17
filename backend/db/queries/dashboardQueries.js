const pool = require("../db")

const getAdminDashboardStats = async () => {

  const totalFlats = await pool.query(
    `SELECT COUNT(*) FROM flats WHERE is_deleted=false`
  )

  const totalCollection = await pool.query(
    `SELECT COALESCE(SUM(amount),0) FROM payments`
  )

  const pendingPayments = await pool.query(
    `SELECT COUNT(*) FROM monthly_records WHERE status='pending'`
  )

  const paidPayments = await pool.query(
    `SELECT COUNT(*) FROM monthly_records WHERE status='paid'`
  )

  return {
    total_flats: Number(totalFlats.rows[0].count),
    total_collection: Number(totalCollection.rows[0].coalesce),
    pending_payments: Number(pendingPayments.rows[0].count),
    paid_payments: Number(paidPayments.rows[0].count)
  }
}

module.exports = {
  getAdminDashboardStats
}