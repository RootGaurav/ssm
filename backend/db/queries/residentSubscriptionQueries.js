const pool = require("../db")

// ALL SUBSCRIPTIONS
const getSubscriptions = async (userId) => {

  const result = await pool.query(
    `
    SELECT
      f.id AS flat_id,
      f.flat_number,
      f.flat_type,
      mr.month,
      mr.year,
      mr.amount,
      mr.status,
      p.payment_mode
    FROM monthly_records mr
    LEFT JOIN payments p
      ON p.flat_id = mr.flat_id
      AND p.month = mr.month
      AND p.year = mr.year
    LEFT JOIN flats f
      ON f.id = mr.flat_id
    WHERE f.user_id = $1
      AND f.is_deleted = false
      AND f.assigned_at IS NOT NULL
      AND MAKE_DATE(mr.year, mr.month, 1) >= f.assigned_at::date
    ORDER BY mr.year DESC, mr.month DESC
    `,
    [userId]
  )

  return result.rows
}


// SINGLE SUBSCRIPTION
const getSubscriptionDetail = async (userId, year, month, flatId = null) => {

  const result = await pool.query(
    `
    SELECT
      f.id AS flat_id,
      f.flat_number,
      f.flat_type,
      mr.month,
      mr.year,
      mr.amount,
      mr.status,
      p.payment_mode,
      p.transaction_id,
      p.created_at AS payment_date
    FROM monthly_records mr
    LEFT JOIN payments p
      ON p.flat_id = mr.flat_id
      AND p.month = mr.month
      AND p.year = mr.year
    LEFT JOIN flats f
      ON f.id = mr.flat_id
    WHERE f.user_id = $1
      AND f.is_deleted = false
      AND f.assigned_at IS NOT NULL
      AND MAKE_DATE(mr.year, mr.month, 1) >= f.assigned_at::date
      AND mr.year = $2
      AND mr.month = $3
      AND ($4::int IS NULL OR mr.flat_id = $4::int)
    ORDER BY mr.flat_id
    LIMIT 1
    `,
    [userId, year, month, flatId]
  )

  return result.rows[0]
}

module.exports = {
  getSubscriptions,
  getSubscriptionDetail
}
