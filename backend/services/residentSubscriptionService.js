const pool = require("../db/db")
const queries = require("../db/queries/residentSubscriptionQueries")

// GET ALL SUBSCRIPTIONS
const getSubscriptions = async (userId) => {
  const flats = await pool.query(
    `SELECT id FROM flats WHERE user_id = $1 AND is_deleted = false LIMIT 1`,
    [userId]
  )

  if (flats.rows.length === 0) {
    return {
      hasAssignedFlat: false,
      message: "No flat is currently assigned to your account.",
      subscriptions: []
    }
  }

  const subscriptions = await queries.getSubscriptions(userId)

  return {
    hasAssignedFlat: true,
    message: null,
    subscriptions
  }
}


// GET SINGLE SUBSCRIPTION
const getSubscriptionDetail = async (userId, year, month, flatId = null) => {
  const flats = await pool.query(
    `SELECT id FROM flats WHERE user_id = $1 AND is_deleted = false LIMIT 1`,
    [userId]
  )

  if (flats.rows.length === 0) {
    return {
      hasAssignedFlat: false,
      message: "No flat is currently assigned to your account.",
      subscription: null
    }
  }

  const subscription = await queries.getSubscriptionDetail(userId, year, month, flatId)

  return {
    hasAssignedFlat: true,
    message: subscription ? null : "Subscription details were not found for this period.",
    subscription
  }
}

module.exports = {
  getSubscriptions,
  getSubscriptionDetail
}
