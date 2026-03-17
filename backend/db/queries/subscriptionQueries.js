const pool = require("../db")

// GET ALL SUBSCRIPTION PLANS
const getAllPlans = async () => {

  const result = await pool.query(
    `
    SELECT *
    FROM subscription_plans
    ORDER BY flat_type
    `
  )

  return result.rows
}


// UPDATE SUBSCRIPTION PLAN
const updatePlan = async (id, amount) => {

  const result = await pool.query(
    `
    UPDATE subscription_plans
    SET monthly_amount = $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [amount, id]
  )

  return result.rows[0]

}

module.exports = {
  getAllPlans,
  updatePlan
}