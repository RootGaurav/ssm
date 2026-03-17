const pool = require("../db")

// GET ALL FLATS
const getAllFlats = async () => {

  const result = await pool.query(

    `SELECT 
        f.id,
        f.flat_number,
        f.flat_type,
        f.status,
        f.phone,
        f.owner_name,
        f.owner_email,
        f.user_id
     FROM flats f
     WHERE f.is_deleted = false
     ORDER BY f.flat_number`

  )
  return result.rows

}
// CREATE FLAT
const createFlat = async (flat) => {

  let { flat_number, owner_name, owner_email, phone, flat_type } = flat


  // If flat is vacant
  if(owner_email === "NA" || !owner_email){

    const result = await pool.query(
      `INSERT INTO flats
      (flat_number, owner_name, owner_email, phone, flat_type, status)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        flat_number,
        owner_name || "NA",
        owner_email || "NA",
        phone || "NA",
        flat_type,
        'vacant'
      ]
    )

    return result.rows[0]
  }

  // Occupied flat
  let userId = flat.user_id
  if (userId) {
    const userCheck = await pool.query(`SELECT id FROM users WHERE id=$1 AND role='resident'`, [userId])
    if (userCheck.rows.length === 0) {
      throw new Error("Selected resident does not exist or is not a resident")
    }
  } else {
    // Check if resident exists by email
    const userCheck = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [owner_email]
    )

    if(userCheck.rows.length === 0){
      throw new Error("Resident does not exist. Register user first.")
    }
    userId = userCheck.rows[0].id
  }

  // Check email uniqueness
  if (owner_email) {
    const emailCheck = await pool.query(`SELECT id FROM users WHERE email=$1 AND id != $2`, [owner_email, userId])
    if (emailCheck.rows.length > 0) {
      throw new Error("Email already in use by another user")
    }
  }

  const result = await pool.query(
    `INSERT INTO flats
    (flat_number, owner_name, owner_email, phone, flat_type, user_id, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [
      flat_number,
      owner_name,
      owner_email,
      phone,
      flat_type,
      userId,
      'occupied'
    ]
  )

  // Update user's flat_id
  await pool.query(`UPDATE users SET flat_id=$1 WHERE id=$2`, [result.rows[0].id, userId])

  return result.rows[0]
}
// UPDATE FLAT
const updateFlat = async (id, flat) => {
  const { flat_number, owner_name, owner_email, phone, flat_type, user_id } = flat

  // Normalize params (frontend may omit or pass empty strings)
  const normalizedUserId = user_id ? parseInt(user_id, 10) : null
  const normalizedOwnerName = owner_name ?? null
  const normalizedOwnerEmail = owner_email ?? null
  const normalizedPhone = phone ?? null
  const normalizedFlatType = flat_type ?? null

  if (normalizedUserId) {
    const userCheck = await pool.query(`SELECT id FROM users WHERE id=$1 AND role='resident'`, [normalizedUserId])
    if (userCheck.rows.length === 0) {
      throw new Error("Selected resident does not exist or is not a resident")
    }
    // Check if email is unique
    if (normalizedOwnerEmail) {
      const emailCheck = await pool.query(`SELECT id FROM users WHERE email=$1 AND id != $2`, [normalizedOwnerEmail, normalizedUserId])
      if (emailCheck.rows.length > 0) {
        throw new Error("Email already in use by another user")
      }
    }
  }

  // Get old user_id
  const oldFlat = await pool.query(`SELECT user_id FROM flats WHERE id=$1`, [id])
  const oldUserId = oldFlat.rows[0]?.user_id

  const result = await pool.query(
    `UPDATE flats
     SET flat_number=$1,
         owner_name=$2,
         owner_email=$3,
         phone=$4,
         flat_type=$5,
         user_id=$6::int,
         status = CASE WHEN owner_email IS NOT NULL AND owner_email != '' AND owner_email != 'NA' THEN 'occupied' ELSE 'vacant' END
     WHERE id=$7
     RETURNING *`,
    [flat_number, normalizedOwnerName, normalizedOwnerEmail, normalizedPhone, normalizedFlatType, normalizedUserId, id]
  )

  // Handle user assignment
  if (oldUserId && oldUserId !== normalizedUserId) {
    // Unassign old user
    await pool.query(`UPDATE users SET flat_id=NULL WHERE id=$1`, [oldUserId])
  }
  if (normalizedUserId) {
    // Assign new user and update details
    await pool.query(
      `UPDATE users SET flat_id=$1, name=$2, email=$3, phone=$4 WHERE id=$5`,
      [id, owner_name, owner_email, phone, normalizedUserId]
    )
  }

  return result.rows[0]
}

// SOFT DELETE FLAT
const deleteFlat = async (id) => {
  // First, remove flat_id from any assigned users
  await pool.query(
    `UPDATE users
     SET flat_id = NULL
     WHERE flat_id = $1 AND role = 'resident'`,
    [id]
  )

  // Then mark the flat as deleted
  await pool.query(
    `UPDATE flats
     SET is_deleted = true
     WHERE id = $1`,
    [id]
  )
}

module.exports = {
  getAllFlats,
  createFlat,
  updateFlat,
  deleteFlat
}