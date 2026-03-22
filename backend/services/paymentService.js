const paymentQueries = require("../db/queries/paymentQueries")
const pool = require("../db/db")

const createOfflinePayment = async (data) => {

  const { flat_id, month, year, amount, payment_mode } = data

  if (!flat_id || !month || !year || !amount) {
    throw new Error("Missing required fields")
  }

  if (!["cash","upi"].includes(payment_mode)) {
    throw new Error("Invalid payment mode")
  }

  return await paymentQueries.createOfflinePayment(data)

}

const getPaymentsByFlat = async (flatId) => {

  if (!flatId) {
    throw new Error("Flat ID required")
  }

  return await paymentQueries.getPaymentsByFlat(flatId)

}

const getPendingMonthlyRecordsByFlat = async (flatId) => {

  if (!flatId) {
    throw new Error("Flat ID required")
  }

  return await paymentQueries.getPendingMonthlyRecordsByFlat(flatId)

}




//resident part



const paySubscription = async (userId, month, year, flatId) => {

  if (!flatId) {
    throw new Error("Flat ID is required")
  }

  const flatAccess = await pool.query(
    `
    SELECT id, flat_number, flat_type
    FROM flats
    WHERE id = $1
      AND user_id = $2
      AND is_deleted = false
    LIMIT 1
    `,
    [flatId, userId]
  )

  if(flatAccess.rows.length === 0){
    throw new Error("User not assigned to flat")
  }

  const record = await pool.query(
    `
    SELECT amount
    FROM monthly_records
    WHERE flat_id=$1
    AND month=$2
    AND year=$3
    `,
    [flatId,month,year]
  )

  if(!record.rows[0]){
    throw new Error("Monthly record not found for this period")
  }

  const amount = record.rows[0].amount

  await paymentQueries.createPayment(flatId,month,year,amount)

  await paymentQueries.markSubscriptionPaid(flatId,month,year)

  // Fetch user and flat details for receipt
  const userDetailsResult = await pool.query(
    `SELECT u.name, u.email, f.flat_number, f.flat_type
     FROM users u
     JOIN flats f ON f.id = $2
     WHERE u.id = $1`,
    [userId, flatId]
  )

  const userDetails = userDetailsResult.rows[0]

  return {
    success:true,
    amount,
    month,
    year,
    userName: userDetails?.name,
    userEmail: userDetails?.email,
    flatNumber: userDetails?.flat_number,
    flatType: userDetails?.flat_type,
    transactionId: `TXN-${Date.now()}`
  }

}



module.exports = {
  createOfflinePayment,
  getPaymentsByFlat,
  getPendingMonthlyRecordsByFlat,
  paySubscription
}
