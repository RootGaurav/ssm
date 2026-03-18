const pool = require("../db")

// CURRENT MONTH STATUS (across all resident flats)
const getCurrentMonthStatus = async (flatIds) => {

  const result = await pool.query(
    `
    SELECT month,year,amount,status
    FROM monthly_records
    WHERE flat_id = ANY($1::int[])
    ORDER BY year DESC,month DESC
    LIMIT 1
    `,
    [flatIds]
  )

  return result.rows[0]

}


// PENDING AMOUNT
const getPendingAmount = async (flatIds) => {

  const result = await pool.query(
    `
    SELECT COALESCE(SUM(amount),0) AS pending_amount
    FROM monthly_records
    WHERE flat_id = ANY($1::int[])
    AND status='pending'
    `,
    [flatIds]
  )

  return result.rows[0]

}


// RECENT PAYMENTS
const getRecentPayments = async (flatIds) => {

  const result = await pool.query(
    `
    SELECT p.month,p.year,p.amount,p.payment_mode,p.created_at,f.flat_number
    FROM payments p
    JOIN flats f ON f.id = p.flat_id
    WHERE p.flat_id = ANY($1::int[])
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [flatIds]
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
