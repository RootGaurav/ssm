const pool = require("../db")

// CREATE OFFLINE PAYMENT
const createOfflinePayment = async (data) => {

  const { flat_id, month, year, amount, payment_mode } = data

  const result = await pool.query(
    `INSERT INTO payments
     (flat_id, month, year, amount, payment_mode, status)
     VALUES ($1,$2,$3,$4,$5,'success')
     RETURNING *`,
    [flat_id, month, year, amount, payment_mode]
  )

  // update monthly record status
  await pool.query(
    `UPDATE monthly_records
     SET status='paid'
     WHERE flat_id=$1 AND month=$2 AND year=$3`,
    [flat_id, month, year]
  )

  return result.rows[0]

}


// GET PAYMENTS BY FLAT
const getPaymentsByFlat = async (flatId) => {

  const result = await pool.query(
    `SELECT *
     FROM payments
     WHERE flat_id=$1
     ORDER BY created_at DESC`,
    [flatId]
  )

  return result.rows

}

module.exports = {
  createOfflinePayment,
  getPaymentsByFlat
}