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

// GET RECORDS BY MONTH + YEAR
const getMonthlyRecords = async (month, year) => {

  const result = await pool.query(
    `
    SELECT 
      mr.id,
      f.id AS flat_id,
      f.flat_number,
      f.owner_name,
      f.owner_email,
      f.phone AS owner_phone,
      mr.month,
      mr.year,
      mr.amount,
      mr.status
    FROM monthly_records mr
    JOIN flats f ON mr.flat_id = f.id
    WHERE mr.month = $1
    AND mr.year = $2
    AND f.is_deleted = false
    AND f.status = 'occupied'
    ORDER BY f.flat_number
    `,
    [month, year]
  )

  return result.rows
}


// GENERATE RECORDS FOR ALL FLATS
const generateMonthlyRecords = async (month, year) => {

  const result = await pool.query(
    `
    INSERT INTO monthly_records (flat_id, month, year, amount)
    SELECT 
      f.id,
      $1,
      $2,
      sp.monthly_amount
    FROM flats f
    JOIN subscription_plans sp
      ON sp.flat_type = f.flat_type
    WHERE f.is_deleted = false
    ON CONFLICT (flat_id, month, year) DO NOTHING
    RETURNING *
    `,
    [month, year]
  )

  return result.rows
}


// MARK PAID
const updateMonthlyRecord = async (id, status) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const existing = await client.query(
      `
      SELECT id, flat_id, month, year, amount
      FROM monthly_records
      WHERE id = $1
      FOR UPDATE
      `,
      [id]
    )

    if (!existing.rows[0]) {
      await client.query("ROLLBACK")
      return null
    }

    const record = existing.rows[0]

    const result = await client.query(
      `
      UPDATE monthly_records
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    )

    if (status === "paid") {
      await syncPaymentsSequence(client)
      await client.query(
        `
        INSERT INTO payments
          (flat_id, month, year, amount, payment_mode, transaction_id, status)
        VALUES
          ($1, $2, $3, $4, 'online', $5, 'success')
        ON CONFLICT (flat_id, month, year)
        DO UPDATE SET
          amount = EXCLUDED.amount,
          payment_mode = 'online',
          status = 'success',
          transaction_id = COALESCE(payments.transaction_id, EXCLUDED.transaction_id)
        `,
        [
          record.flat_id,
          record.month,
          record.year,
          record.amount,
          `ADMIN-${Date.now()}-${record.id}`,
        ]
      )
    }

    await client.query("COMMIT")
    return result.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  getMonthlyRecords,
  generateMonthlyRecords,
  updateMonthlyRecord
}
