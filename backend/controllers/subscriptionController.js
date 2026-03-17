const subscriptionService = require("../services/subscriptionService")


// GET ALL SUBSCRIPTION PLANS
const getAllPlans = async (req, res) => {

  try {

    const plans = await subscriptionService.getAllPlans()

    res.json(plans)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: "Failed to fetch subscription plans"
    })

  }

}


// UPDATE PLAN
const updatePlan = async (req, res) => {

  try {

    const id = req.params.id
    const { monthly_amount } = req.body

    const plan = await subscriptionService.updatePlan(
      id,
      monthly_amount
    )

    res.json(plan)

  } catch (error) {

    console.error(error)

    res.status(400).json({
      error: error.message || "Failed to update subscription plan"
    })

  }

}


module.exports = {
  getAllPlans,
  updatePlan
}