const express = require("express")
const cors = require("cors")
const session = require("express-session")
const passport = require("passport")
const bcrypt = require("bcrypt")

require("dotenv").config()





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
const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(express.json())


// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}))



//





// Passport configuration
app.use(passport.initialize())
app.use(passport.session())


// Passport Google Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authService = require('./services/authService');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await authService.findOrCreateGoogleUser({
      id: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value
    });
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await authService.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.get("/api/health", async (req, res) => {
  // const hashedPassword = await bcrypt.hash("123456", 10)
  res.json({ message: "API running" })
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

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})