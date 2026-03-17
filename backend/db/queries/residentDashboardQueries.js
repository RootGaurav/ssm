const pool = require("../db")

// CURRENT MONTH STATUS
const getCurrentMonthStatus = async (flatId) => {

  const result = await pool.query(
    `
    SELECT month,year,amount,status
    FROM monthly_records
    WHERE flat_id=$1
    ORDER BY year DESC,month DESC
    LIMIT 1
    `,
    [flatId]
  )

  return result.rows[0]

}


// PENDING AMOUNT
const getPendingAmount = async (flatId) => {

  const result = await pool.query(
    `
    SELECT COALESCE(SUM(amount),0) AS pending_amount
    FROM monthly_records
    WHERE flat_id=$1
    AND status='pending'
    `,
    [flatId]
  )

  return result.rows[0]

}


// RECENT PAYMENTS
const getRecentPayments = async (flatId) => {

  const result = await pool.query(
    `
    SELECT month,year,amount,payment_mode,created_at
    FROM payments
    WHERE flat_id=$1
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [flatId]
  )

  return result.rows

}


// NOTIFICATIONS
const getNotifications = async (flatId,userId) => {

  const result = await pool.query(
    `
    SELECT *
    FROM notifications
    WHERE
      target_type='all'
      OR flat_id=$1
      OR user_id=$2
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [flatId,userId]
  )

  return result.rows

}

module.exports = {
  getCurrentMonthStatus,
  getPendingAmount,
  getRecentPayments,
  getNotifications
}