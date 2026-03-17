const pool = require("../db")

// GET ALL MONTHLY RECORDS
const getMonthlyRecords = async () => {

  const result = await pool.query(`
    SELECT 
      mr.id,
      f.flat_number,
      mr.month,
      mr.year,
      mr.amount,
      mr.status
    FROM monthly_records mr
    JOIN flats f ON mr.flat_id = f.id
    WHERE f.is_deleted = false
    ORDER BY mr.year DESC, mr.month DESC
  `)

  return result.rows
}


// CREATE MONTHLY RECORD
const createMonthlyRecord = async (data) => {

  const { flat_id, month, year, amount } = data

  const result = await pool.query(
    `INSERT INTO monthly_records
     (flat_id, month, year, amount)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [flat_id, month, year, amount]
  )

  return result.rows[0]

}


// UPDATE STATUS
const updateMonthlyRecord = async (id, status) => {

  const result = await pool.query(
    `UPDATE monthly_records
     SET status=$1
     WHERE id=$2
     RETURNING *`,
    [status, id]
  )

  return result.rows[0]

}

module.exports = {
  getMonthlyRecords,
  createMonthlyRecord,
  updateMonthlyRecord
}