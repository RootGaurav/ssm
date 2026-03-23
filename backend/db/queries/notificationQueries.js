const pool = require("../db")

const syncNotificationsSequence = async (client) => {
  await client.query(
    `
    SELECT setval(
      pg_get_serial_sequence('notifications', 'id'),
      COALESCE((SELECT MAX(id) FROM notifications), 0) + 1,
      false
    )
    `
  )
}

// GET ALL NOTIFICATIONS
const getNotifications = async () => {

  const result = await pool.query(`
    SELECT
      n.*,
      f.flat_number,
      u.name as resident_name
    FROM notifications n
    LEFT JOIN flats f ON n.flat_id = f.id
    LEFT JOIN users u ON n.user_id = u.id
    ORDER BY n.created_at DESC
  `)

  return result.rows
}


// CREATE NOTIFICATION
const createNotification = async (data) => {

  const { title, message, target_type, flat_id, user_id } = data
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    await syncNotificationsSequence(client)

    const result = await client.query(
      `
      INSERT INTO notifications
      (title, message, target_type, flat_id, user_id)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        title,
        message,
        target_type,
        flat_id || null,
        user_id || null
      ]
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

const getEmailsForAllResidents = async () => {
  const result = await pool.query(
    `
    SELECT email
    FROM users
    WHERE role = 'resident'
      AND email IS NOT NULL
      AND TRIM(email) <> ''
    `
  )

  return result.rows.map((row) => row.email)
}

const getEmailsForFlat = async (flatId) => {
  const result = await pool.query(
    `
    SELECT COALESCE(u.email, f.owner_email) AS email
    FROM flats f
    LEFT JOIN users u ON u.id = f.user_id
    WHERE f.id = $1
    `,
    [flatId]
  )

  return result.rows
    .map((row) => row.email)
    .filter(Boolean)
}

const getEmailsForResident = async (userId) => {
  const result = await pool.query(
    `
    SELECT email
    FROM users
    WHERE id = $1
      AND role = 'resident'
      AND email IS NOT NULL
      AND TRIM(email) <> ''
    `,
    [userId]
  )

  return result.rows.map((row) => row.email)
}

module.exports = {
  getNotifications,
  createNotification,
  getEmailsForAllResidents,
  getEmailsForFlat,
  getEmailsForResident,
}
