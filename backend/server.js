const express = require("express")
const cors = require("cors")
const helmet = require("helmet")

require("dotenv").config()

const app = express()

// Routes
const flatRoutes = require("./routes/flatRoutes")
const residentRoutes = require("./routes/residentRoutes")
const subscriptionRoutes = require("./routes/subscriptionRoutes")
const monthlyRecordRoutes = require("./routes/monthlyRecordRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const reportRoutes = require("./routes/reportRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const authRoutes = require("./routes/authRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const profileRoutes = require("./routes/profileRoutes")
const residentDashboardRoutes = require("./routes/residentDashboardRoutes")
const residentSubscriptions = require("./routes/residentSubscriptions")
const residentProfileRoutes = require("./routes/residentProfileRoutes")

// ✅ Security
app.use(helmet())

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  // origin:"*",
  credentials: true
}))

app.use(express.json())

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "API running" })
})

// ✅ Razorpay key
app.get("/api/payments/razorpay-key", (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID })
})

app.use("/api/flats", flatRoutes)
app.use("/api/residents", residentRoutes)
app.use("/api/subscriptions", subscriptionRoutes)
app.use("/api/monthly-records", monthlyRecordRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/resident/profile", residentProfileRoutes)
app.use("/api/resident/dashboard", residentDashboardRoutes)
app.use("/api/resident/subscriptions", residentSubscriptions)

app.use((err, req, res, next) => {
  console.error("Error:", err.stack)
  res.status(500).json({ error: "Internal Server Error" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


