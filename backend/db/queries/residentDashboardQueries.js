const pool = require("../db")

// CURRENT MONTH STATUS (across all resident flats)
const getCurrentMonthStatus = async (userId) => {

  const result = await pool.query(
    `
    SELECT mr.month,mr.year,mr.amount,mr.status
    FROM monthly_records mr
    JOIN flats f ON f.id = mr.flat_id
    WHERE f.user_id = $1
      AND f.is_deleted = false
      AND f.assigned_at IS NOT NULL
      AND MAKE_DATE(mr.year, mr.month, 1) >= f.assigned_at::date
    ORDER BY year DESC,month DESC
    LIMIT 1
    `,
    [userId]
  )

  return result.rows[0]

}


// PENDING AMOUNT
const getPendingAmount = async (userId) => {

  const result = await pool.query(
    `
    SELECT COALESCE(SUM(mr.amount),0) AS pending_amount
    FROM monthly_records mr
    JOIN flats f ON f.id = mr.flat_id
    WHERE f.user_id = $1
      AND f.is_deleted = false
      AND f.assigned_at IS NOT NULL
      AND MAKE_DATE(mr.year, mr.month, 1) >= f.assigned_at::date
      AND mr.status='pending'
    `,
    [userId]
  )

  return result.rows[0]

}


// RECENT PAYMENTS
const getRecentPayments = async (userId) => {

  const result = await pool.query(
    `
    SELECT p.month,p.year,p.amount,p.payment_mode,p.created_at,f.flat_number
    FROM payments p
    JOIN flats f ON f.id = p.flat_id
    WHERE f.user_id = $1
      AND f.is_deleted = false
      AND f.assigned_at IS NOT NULL
      AND MAKE_DATE(p.year, p.month, 1) >= f.assigned_at::date
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [userId]
  )

  return result.rows

}


// NOTIFICATIONS
const getNotifications = async (flatIds,userId) => {

  const result = await pool.query(
    `
    SELECT *
    FROM notifications
    WHERE
      target_type='all'
      OR flat_id = ANY($1::int[])
      OR user_id=$2
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [flatIds,userId]
  )

  return result.rows

}

module.exports = {
  getCurrentMonthStatus,
  getPendingAmount,
  getRecentPayments,
  getNotifications
}
