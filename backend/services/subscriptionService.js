const subscriptionQueries = require("../db/queries/subscriptionQueries")

const getAllPlans = async () => {
  return await subscriptionQueries.getAllPlans()
}

const updatePlan = async (id, amount) => {
  return await subscriptionQueries.updatePlan(id, amount)
}

module.exports = {
  getAllPlans,
  updatePlan
}