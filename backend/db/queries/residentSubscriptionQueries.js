const pool = require("../db")

// ALL SUBSCRIPTIONS
const getSubscriptions = async (flatId) => {

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
    WHERE mr.flat_id = $1
    ORDER BY mr.year DESC, mr.month DESC
    `,
    [flatId]
  )

  return result.rows
}


// SINGLE SUBSCRIPTION
const getSubscriptionDetail = async (flatId, year, month) => {

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
    WHERE mr.flat_id = $1
    AND mr.year = $2
    AND mr.month = $3
    `,
    [flatId, year, month]
  )

  return result.rows[0]
}

module.exports = {
  getSubscriptions,
  getSubscriptionDetail
}