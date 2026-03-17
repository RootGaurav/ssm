const pool = require("../db")

// MONTHLY REPORT
const getMonthlyReport = async () => {

  const result = await pool.query(`
    SELECT 
      month,
      year,
      SUM(amount) AS total_collection
    FROM payments
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
    GROUP BY year
    ORDER BY year DESC
  `)

  return result.rows
}

module.exports = {
  getMonthlyReport,
  getYearlyReport
}