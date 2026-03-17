const pool = require("../db")

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

  const result = await pool.query(
    `
    UPDATE monthly_records
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  )

  return result.rows[0]
}

module.exports = {
  getMonthlyRecords,
  generateMonthlyRecords,
  updateMonthlyRecord
}