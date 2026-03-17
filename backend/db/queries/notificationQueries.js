const pool = require("../db")

// GET ALL NOTIFICATIONS
const getNotifications = async () => {

  const result = await pool.query(`
    SELECT *
    FROM notifications
    ORDER BY created_at DESC
  `)

  return result.rows
}

// CREATE NOTIFICATION
const createNotification = async (data) => {

  const { title, message } = data

  const result = await pool.query(
    `INSERT INTO notifications
     (title, message)
     VALUES ($1,$2)
     RETURNING *`,
    [title, message]
  )

  return result.rows[0]
}

module.exports = {
  getNotifications,
  createNotification
}