const pool = require("../db")

function normalizeOptionalText(value) {
  if (value === undefined || value === null) return null

  const normalizedValue = String(value).trim()

  return normalizedValue === "" ? null : normalizedValue
}

const syncFlatsSequence = async (client) => {
  await client.query(
    `
    SELECT setval(
      pg_get_serial_sequence('flats', 'id'),
      COALESCE((SELECT MAX(id) FROM flats), 0) + 1,
      false
    )
    `
  )
}

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
        f.user_id,
        f.assigned_at
     FROM flats f
     WHERE f.is_deleted = false
     ORDER BY f.flat_number`
  )

  return result.rows
}

// CREATE FLAT
const createFlat = async (flat) => {
  const { flat_number, owner_name, owner_email, phone, flat_type } = flat
  const normalizedFlatNumber = flat_number ?? null
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    await syncFlatsSequence(client)

    if(normalizedFlatNumber) {
      const flatCheck = await client.query(
        `SELECT id FROM flats WHERE flat_number=$1 AND is_deleted = false`,
        [normalizedFlatNumber]
      )

      if (flatCheck.rows.length > 0) {
        throw new Error("Flat already exists")
      }
    }
    // Vacant flat
    if (owner_email === "NA" || !owner_email) {
      const result = await client.query(
        `INSERT INTO flats
        (flat_number, owner_name, owner_email, phone, flat_type, status, user_id, assigned_at)
        VALUES ($1,$2,$3,$4,$5,$6,NULL,NULL)
        RETURNING *`,
        [
          normalizedFlatNumber,
          owner_name || "NA",
          owner_email || "NA",
          phone || "NA",
          flat_type,
          "vacant",
        ]
      )

      await client.query("COMMIT")
      return result.rows[0]
    }

    // Occupied flat
    let userId = flat.user_id

    if (userId) {
      const userCheck = await client.query(
        `SELECT id FROM users WHERE id = $1 AND role = 'resident'`,
        [userId]
      )

      if (userCheck.rows.length === 0) {
        throw new Error("Selected resident does not exist or is not a resident")
      }
    } else {
      const userCheck = await client.query(
        `SELECT id FROM users WHERE email = $1 AND role = 'resident'`,
        [owner_email]
      )

      if (userCheck.rows.length === 0) {
        throw new Error("Resident does not exist. Register user first.")
      }

      userId = userCheck.rows[0].id
    }

    if (owner_email) {
      const emailCheck = await client.query(
        `SELECT id FROM users WHERE email = $1 AND id != $2`,
        [owner_email, userId]
      )

      if (emailCheck.rows.length > 0) {
        throw new Error("Email already in use by another user")
      }
    }

    const result = await client.query(
      `INSERT INTO flats
      (flat_number, owner_name, owner_email, phone, flat_type, user_id, status, assigned_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
      RETURNING *`,
      [flat_number, owner_name, owner_email, phone, flat_type, userId, "occupied"]
    )

    await client.query("COMMIT")
    return result.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }

}

// UPDATE FLAT
const updateFlat = async (id, flat) => {
  const { flat_number, owner_name, owner_email, phone, flat_type, user_id } = flat

  const normalizedUserId = user_id ? parseInt(user_id, 10) : null
  const normalizedOwnerName = normalizeOptionalText(owner_name)
  const normalizedOwnerEmail = normalizeOptionalText(owner_email)
  const normalizedPhone = normalizeOptionalText(phone)
  const normalizedFlatType = normalizeOptionalText(flat_type)
  const normalizedFlatNumber = normalizeOptionalText(flat_number)

  if(normalizedFlatNumber) {
    const flatCheck = await pool.query(
      `SELECT id FROM flats WHERE flat_number=$1 AND id != $2 AND is_deleted = false`,
      [normalizedFlatNumber, id]
    )

    if (flatCheck.rows.length > 0) {
      throw new Error("Flat number already exists")
    }
  }
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
     SET flat_number=$1::text,
         owner_name=$2::text,
         owner_email=$3::text,
         phone=$4::text,
         flat_type=$5::text,
         user_id=$6::int,
         assigned_at = CASE
           WHEN $6::int IS NULL THEN NULL
           WHEN user_id IS DISTINCT FROM $6::int OR status != 'occupied' THEN NOW()
           ELSE assigned_at
         END,
         status = CASE
           WHEN $6::int IS NOT NULL THEN 'occupied'
           WHEN COALESCE($3::text, '') NOT IN ('', 'NA') THEN 'occupied'
           ELSE 'vacant'
         END
     WHERE id=$7
     RETURNING *`,
    [
      normalizedFlatNumber,
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
         user_id = NULL,
         assigned_at = NULL
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
