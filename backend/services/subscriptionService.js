const subscriptionQueries = require("../db/queries/subscriptionQueries")

// GET ALL PLANS
const getAllPlans = async () => {

  return await subscriptionQueries.getAllPlans()

}


// UPDATE PLAN
const updatePlan = async (id, amount) => {

  if (!amount || amount <= 0) {
    throw new Error("Invalid monthly amount")
  }

  return await subscriptionQueries.updatePlan(id, amount)

}

module.exports = {
  getAllPlans,
  updatePlan
}