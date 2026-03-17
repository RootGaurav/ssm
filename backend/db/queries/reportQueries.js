const pool = require("../db")

// MONTHLY REPORT
const getMonthlyReport = async () => {

  const result = await pool.query(`
    SELECT
      month,
      year,
      SUM(amount) AS total_collection,
      COUNT(*) FILTER (WHERE payment_mode='cash') AS cash_payments,
      COUNT(*) FILTER (WHERE payment_mode='upi') AS upi_payments
    FROM payments
    WHERE status='success'
    GROUP BY month, year
    ORDER BY year DESC, month DESC
  `)

  return result.rows
}



// YEARLY REPORT
const getYearlyReport = async () => {

  const result = await pool.query(`
    SELECT
      year,
      SUM(amount) AS total_collection
    FROM payments
    WHERE status='success'
    GROUP BY year
    ORDER BY year DESC
  `)

  return result.rows
}



// PENDING PAYMENTS
const getPendingPayments = async () => {

  const result = await pool.query(`
    SELECT
      COUNT(*) AS pending_count,
      SUM(amount) AS pending_amount
    FROM monthly_records
    WHERE status='pending'
  `)

  return result.rows[0]

}

module.exports = {
  getMonthlyReport,
  getYearlyReport,
  getPendingPayments
}