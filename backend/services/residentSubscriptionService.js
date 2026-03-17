const pool = require("../db/db")
const queries = require("../db/queries/residentSubscriptionQueries")

// GET ALL SUBSCRIPTIONS
const getSubscriptions = async (userId) => {

  const user = await pool.query(
    `SELECT flat_id FROM users WHERE id=$1`,
    [userId]
  )

  const flatId = user.rows[0]?.flat_id

  if(!flatId){
    throw new Error("User not assigned to flat")
  }

  return await queries.getSubscriptions(flatId)
}


// GET SINGLE SUBSCRIPTION
const getSubscriptionDetail = async (userId, year, month) => {

  const user = await pool.query(
    `SELECT flat_id FROM users WHERE id=$1`,
    [userId]
  )

  const flatId = user.rows[0]?.flat_id

  if(!flatId){
    throw new Error("User not assigned to flat")
  }

  return await queries.getSubscriptionDetail(flatId, year, month)
}

module.exports = {
  getSubscriptions,
  getSubscriptionDetail
}