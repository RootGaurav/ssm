const pool = require("../db")

const syncUsersSequence = async (client) => {
  await client.query(
    `
    SELECT setval(
      pg_get_serial_sequence('users', 'id'),
      COALESCE((SELECT MAX(id) FROM users), 0) + 1,
      false
    )
    `
  )
}

// GET ALL RESIDENTS
// Keep `flat_id` in response for frontend compatibility (first assigned flat)
const getAllResidents = async () => {
  const result = await pool.query(
    `
    SELECT
      u.*,
      f.id AS flat_id,
      COALESCE(fc.flat_count, 0) AS flat_count
    FROM users u
    LEFT JOIN LATERAL (
      SELECT id
      FROM flats
      WHERE user_id = u.id
        AND is_deleted = false
      ORDER BY id
      LIMIT 1
    ) f ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::int AS flat_count
      FROM flats
      WHERE user_id = u.id
        AND is_deleted = false
    ) fc ON true
    WHERE u.role = 'resident'
    ORDER BY u.name
    `
  )

  return result.rows
}

// CREATE RESIDENT
const createResident = async (resident) => {
  const { name, email, password, phone, flat_id } = resident

  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    await syncUsersSequence(client)

    const result = await client.query(
      `
      INSERT INTO users (name, email, password, phone, role)
      VALUES ($1, $2, $3, $4, 'resident')
      RETURNING *
      `,
      [name, email, password, phone]
    )

    if (flat_id) {
      await client.query(
        `
        UPDATE flats
        SET owner_name = $1,
            owner_email = $2,
            phone = $3,
            status = 'occupied',
            user_id = $4,
            assigned_at = NOW()
        WHERE id = $5
        `,
        [name, email, phone, result.rows[0].id, flat_id]
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

// UPDATE RESIDENT
const updateResident = async (id, resident) => {
  const { name, email, phone, flat_id } = resident

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const result = await client.query(
      `
      UPDATE users
      SET name = $1,
          email = $2,
          phone = $3
      WHERE id = $4
        AND role = 'resident'
      RETURNING *
      `,
      [name, email, phone, id]
    )

    if (!result.rows[0]) {
      await client.query("ROLLBACK")
      return null
    }

    // Keep all assigned flats owner details in sync with user profile.
    await client.query(
      `
      UPDATE flats
      SET owner_name = $1,
          owner_email = $2,
          phone = $3,
          status = CASE WHEN user_id IS NOT NULL THEN 'occupied' ELSE status END
      WHERE user_id = $4
      `,
      [name, email, phone, id]
    )

    // Optional: also assign this resident to one more flat.
    if (flat_id) {
      await client.query(
        `
        UPDATE flats
        SET owner_name = $1,
            owner_email = $2,
            phone = $3,
            status = 'occupied',
            user_id = $4,
            assigned_at = NOW()
        WHERE id = $5
        `,
        [name, email, phone, id, flat_id]
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

// DELETE RESIDENT
const deleteResident = async (id) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    await client.query(
      `
      UPDATE flats
      SET owner_name = NULL,
          owner_email = NULL,
          phone = NULL,
          status = 'vacant',
          user_id = NULL,
          assigned_at = NULL
      WHERE user_id = $1
      `,
      [id]
    )

    await client.query(
      "DELETE FROM users WHERE id = $1 AND role = 'resident'",
      [id]
    )

    await client.query("COMMIT")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// ASSIGN RESIDENT TO FLAT
const assignResidentToFlat = async (residentId, flatId) => {
  const resident = await pool.query(
    "SELECT * FROM users WHERE id = $1 AND role = 'resident'",
    [residentId]
  )

  if (resident.rows.length === 0) throw new Error("Resident not found")

  const { name, email, phone } = resident.rows[0]

  await pool.query(
    `
    UPDATE flats
    SET owner_name = $1,
        owner_email = $2,
        phone = $3,
        status = 'occupied',
        user_id = $4,
        assigned_at = NOW()
    WHERE id = $5
    `,
    [name, email, phone, residentId, flatId]
  )
}

// VACATE FLAT
const vacateFlat = async (flatId) => {
  await pool.query(
    `
    UPDATE flats
    SET owner_name = NULL,
        owner_email = NULL,
        phone = NULL,
        status = 'vacant',
        user_id = NULL,
        assigned_at = NULL
    WHERE id = $1
    `,
    [flatId]
  )
}

module.exports = {
  getAllResidents,
  createResident,
  updateResident,
  deleteResident,
  assignResidentToFlat,
  vacateFlat,
}
