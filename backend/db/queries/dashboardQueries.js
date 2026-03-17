const pool = require("../db")

// TOTAL FLATS
const getTotalFlats = async () => {

  const result = await pool.query(`
    SELECT COUNT(*) AS total_flats
    FROM flats
    WHERE is_deleted = false
  `)

  return result.rows[0]

}


// OCCUPIED FLATS
const getOccupiedFlats = async () => {

  const result = await pool.query(`
    SELECT COUNT(*) AS occupied_flats
    FROM flats
    WHERE status = 'occupied'
  `)

  return result.rows[0]

}


// TOTAL COLLECTION
const getTotalCollection = async () => {

  const result = await pool.query(`
    SELECT COALESCE(SUM(amount),0) AS total_collection
    FROM payments
    WHERE status = 'success'
  `)

  return result.rows[0]

}


// PENDING PAYMENTS
const getPendingPayments = async () => {

  const result = await pool.query(`
    SELECT COUNT(*) AS pending_count,
           COALESCE(SUM(amount),0) AS pending_amount
    FROM monthly_records
    WHERE status = 'pending'
  `)

  return result.rows[0]

}


// MONTHLY COLLECTION TREND
const getMonthlyTrend = async () => {

  const result = await pool.query(`
    SELECT
      month,
      year,
      SUM(amount) AS total_collection
    FROM payments
    WHERE status='success'
    GROUP BY month,year
    ORDER BY year,month
  `)

  return result.rows

}

module.exports = {
  getTotalFlats,
  getOccupiedFlats,
  getTotalCollection,
  getPendingPayments,
  getMonthlyTrend
}