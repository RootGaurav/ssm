const pool = require("../db")

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

  const result = await pool.query(
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

  return result.rows[0]

}

module.exports = {
  getNotifications,
  createNotification
}