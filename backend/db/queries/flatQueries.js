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
  const { flat_number, owner_name, owner_email, phone, flat_type } = flat

  // Vacant flat
  if (owner_email === "NA" || !owner_email) {
    const result = await pool.query(
      `INSERT INTO flats
      (flat_number, owner_name, owner_email, phone, flat_type, status, user_id)
      VALUES ($1,$2,$3,$4,$5,$6,NULL)
      RETURNING *`,
      [
        flat_number,
        owner_name || "NA",
        owner_email || "NA",
        phone || "NA",
        flat_type,
        "vacant",
      ]
    )

    return result.rows[0]
  }

  // Occupied flat
  let userId = flat.user_id

  if (userId) {
    const userCheck = await pool.query(
      `SELECT id FROM users WHERE id = $1 AND role = 'resident'`,
      [userId]
    )

    if (userCheck.rows.length === 0) {
      throw new Error("Selected resident does not exist or is not a resident")
    }
  } else {
    const userCheck = await pool.query(
      `SELECT id FROM users WHERE email = $1 AND role = 'resident'`,
      [owner_email]
    )

    if (userCheck.rows.length === 0) {
      throw new Error("Resident does not exist. Register user first.")
    }

    userId = userCheck.rows[0].id
  }

  if (owner_email) {
    const emailCheck = await pool.query(
      `SELECT id FROM users WHERE email = $1 AND id != $2`,
      [owner_email, userId]
    )

    if (emailCheck.rows.length > 0) {
      throw new Error("Email already in use by another user")
    }
  }

  const result = await pool.query(
    `INSERT INTO flats
    (flat_number, owner_name, owner_email, phone, flat_type, user_id, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [flat_number, owner_name, owner_email, phone, flat_type, userId, "occupied"]
  )

  return result.rows[0]
}

// UPDATE FLAT
const updateFlat = async (id, flat) => {
  const { flat_number, owner_name, owner_email, phone, flat_type, user_id } = flat

  const normalizedUserId = user_id ? parseInt(user_id, 10) : null
  const normalizedOwnerName = owner_name ?? null
  const normalizedOwnerEmail = owner_email ?? null
  const normalizedPhone = phone ?? null
  const normalizedFlatType = flat_type ?? null

  if (normalizedUserId) {
    const userCheck = await pool.query(
      `SELECT id FROM users WHERE id=$1 AND role='resident'`,
      [normalizedUserId]
    )

    if (userCheck.rows.length === 0) {
      throw new Error("Selected resident does not exist or is not a resident")
    }

    if (normalizedOwnerEmail) {
      const emailCheck = await pool.query(
        `SELECT id FROM users WHERE email=$1 AND id != $2`,
        [normalizedOwnerEmail, normalizedUserId]
      )

      if (emailCheck.rows.length > 0) {
        throw new Error("Email already in use by another user")
      }
    }
  }

  const result = await pool.query(
    `UPDATE flats
     SET flat_number=$1,
         owner_name=$2,
         owner_email=$3,
         phone=$4,
         flat_type=$5,
         user_id=$6::int,
         status = CASE
           WHEN $6::int IS NOT NULL THEN 'occupied'
           WHEN $3 IS NOT NULL AND $3 != '' AND $3 != 'NA' THEN 'occupied'
           ELSE 'vacant'
         END
     WHERE id=$7
     RETURNING *`,
    [
      flat_number,
      normalizedOwnerName,
      normalizedOwnerEmail,
      normalizedPhone,
      normalizedFlatType,
      normalizedUserId,
      id,
    ]
  )

  // Keep resident profile details synced from flat edit when resident selected.
  if (normalizedUserId) {
    await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone)
       WHERE id = $4`,
      [normalizedOwnerName, normalizedOwnerEmail, normalizedPhone, normalizedUserId]
    )
  }

  return result.rows[0]
}

// SOFT DELETE FLAT
const deleteFlat = async (id) => {
  await pool.query(
    `UPDATE flats
     SET is_deleted = true,
         status = 'vacant',
         owner_name = NULL,
         owner_email = NULL,
         phone = NULL,
         user_id = NULL
     WHERE id = $1`,
    [id]
  )
}

module.exports = {
  getAllFlats,
  createFlat,
  updateFlat,
  deleteFlat,
}
