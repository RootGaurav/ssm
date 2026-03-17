const pool = require("../db")

// GET ALL RESIDENTS
const getAllResidents = async () => {
  const result = await pool.query("SELECT * FROM users WHERE role = 'resident' ORDER BY name")
  return result.rows
}

// CREATE RESIDENT
const createResident = async (resident) => {
  const { name, email, password, phone, flat_id} = resident
  
  // Create resident user
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role, flat_id) VALUES ($1, $2, $3, $4, 'resident', $5) RETURNING *`,
    [name, email, password, phone, flat_id]
  )
  
  // Update flat with resident details if flat_id provided
  if (flat_id) {
    await pool.query(
      `UPDATE flats SET owner_name = $1, owner_email = $2, phone = $3, status = 'occupied' WHERE id = $4`,
      [name, email, phone, flat_id]
    )
  }
  
  return result.rows[0]
}

// UPDATE RESIDENT
const updateResident = async (id, resident) => {
  const { name, email, phone, flat_id } = resident
  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2, phone = $3, flat_id = $4 WHERE id = $5 AND role = 'resident' RETURNING *`,
    [name, email, phone, flat_id, id]
  )
  return result.rows[0]
}

// DELETE RESIDENT
const deleteResident = async (id) => {
  await pool.query("DELETE FROM users WHERE id = $1 AND role = 'resident'", [id])
}

// ASSIGN RESIDENT TO FLAT
const assignResidentToFlat = async (residentId, flatId) => {
  // Get resident details
  const resident = await pool.query("SELECT * FROM users WHERE id = $1 AND role = 'resident'", [residentId])
  if (resident.rows.length === 0) throw new Error("Resident not found")

  const { name, email, phone } = resident.rows[0]

  // Update flat with resident details and status
  await pool.query(
    `UPDATE flats SET owner_name = $1, owner_email = $2, phone = $3, status = 'occupied' WHERE id = $4`,
    [name, email, phone, flatId]
  )

  // Update resident flat_id
  await pool.query("UPDATE users SET flat_id = $1 WHERE id = $2 AND role = 'resident'", [flatId, residentId])
}

// VACATE FLAT
const vacateFlat = async (flatId) => {
  // Clear flat owner details and set status to vacant
  await pool.query("UPDATE flats SET owner_name = NULL, owner_email = NULL, phone = NULL, status = 'vacant' WHERE id = $1", [flatId])

  // Clear resident flat_id
  await pool.query("UPDATE users SET flat_id = NULL WHERE flat_id = $1 AND role = 'resident'", [flatId])
}

module.exports = {
  getAllResidents,
  createResident,
  updateResident,
  deleteResident,
  assignResidentToFlat,
  vacateFlat
}