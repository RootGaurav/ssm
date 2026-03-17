const pool = require("../db")

// CREATE OFFLINE PAYMENT
const createOfflinePayment = async (data) => {

  const { flat_id, month, year, amount, payment_mode } = data

  const client = await pool.connect()

  try {

    await client.query("BEGIN")

    const paymentResult = await client.query(
      `
      INSERT INTO payments
      (flat_id, month, year, amount, payment_mode, status)
      VALUES ($1,$2,$3,$4,$5,'success')
      RETURNING *
      `,
      [flat_id, month, year, amount, payment_mode]
    )

    // Update monthly record
    await client.query(
      `
      UPDATE monthly_records
      SET status = 'paid'
      WHERE flat_id = $1
      AND month = $2
      AND year = $3
      `,
      [flat_id, month, year]
    )

    await client.query("COMMIT")

    return paymentResult.rows[0]

  } catch (err) {

    await client.query("ROLLBACK")
    
    if (err.code === "23505") {
      throw new Error("Payment for this flat, month, and year already exists. Please check the records.")
    }
    
    throw err

  } finally {

    client.release()

  }

}


// GET PAYMENTS BY FLAT
const getPaymentsByFlat = async (flatId) => {

  const result = await pool.query(
    `
    SELECT *
    FROM payments
    WHERE flat_id=$1
    ORDER BY created_at DESC
    `,
    [flatId]
  )

  return result.rows

}

module.exports = {
  createOfflinePayment,
  getPaymentsByFlat
}