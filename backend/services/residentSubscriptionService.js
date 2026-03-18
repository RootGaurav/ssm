const pool = require("../db/db")
const queries = require("../db/queries/residentSubscriptionQueries")

// GET ALL SUBSCRIPTIONS
const getSubscriptions = async (userId) => {
  const flats = await pool.query(
    `SELECT id FROM flats WHERE user_id = $1 AND is_deleted = false LIMIT 1`,
    [userId]
  )

  if(flats.rows.length === 0){
    throw new Error("User not assigned to flat")
  }

  return await queries.getSubscriptions(userId)
}


// GET SINGLE SUBSCRIPTION
const getSubscriptionDetail = async (userId, year, month, flatId = null) => {
  const flats = await pool.query(
    `SELECT id FROM flats WHERE user_id = $1 AND is_deleted = false LIMIT 1`,
    [userId]
  )

  if(flats.rows.length === 0){
    throw new Error("User not assigned to flat")
  }

  return await queries.getSubscriptionDetail(userId, year, month, flatId)
}

module.exports = {
  getSubscriptions,
  getSubscriptionDetail
}
