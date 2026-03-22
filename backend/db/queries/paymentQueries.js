const pool = require("../db")

const syncPaymentsSequence = async (client) => {
  await client.query(
    `
    SELECT setval(
      pg_get_serial_sequence('payments', 'id'),
      COALESCE((SELECT MAX(id) FROM payments), 0) + 1,
      false
    )
    `
  )
}

// CREATE OFFLINE PAYMENT
const createOfflinePayment = async (data) => {

  const { flat_id, month, year, amount, payment_mode } = data

  const client = await pool.connect()

  try {

    await client.query("BEGIN")
    await syncPaymentsSequence(client)

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

const getPendingMonthlyRecordsByFlat = async (flatId) => {
  const result = await pool.query(
    `
    SELECT id, month, year, amount, status
    FROM monthly_records
    WHERE flat_id = $1
      AND status = 'pending'
    ORDER BY year DESC, month DESC
    `,
    [flatId]
  )

  return result.rows
}

const createPayment = async (flatId, month, year, amount) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    await syncPaymentsSequence(client)
    await client.query(
      `
      INSERT INTO payments
      (flat_id, month, year, amount, payment_mode, transaction_id, status)
      VALUES ($1,$2,$3,$4,'online',$5,'success')
      `,
      [
        flatId,
        month,
        year,
        amount,
        `MOCK-${Date.now()}`
      ]
    )
    await client.query("COMMIT")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }

}

const markSubscriptionPaid = async (flatId, month, year) => {

  await pool.query(
    `
    UPDATE monthly_records
    SET status='paid'
    WHERE flat_id=$1
    AND month=$2
    AND year=$3
    `,
    [flatId,month,year]
  )

}

module.exports = {
  createPayment,
  markSubscriptionPaid,
  createOfflinePayment,
  getPaymentsByFlat,
  getPendingMonthlyRecordsByFlat
}
