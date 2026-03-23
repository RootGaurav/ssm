const bcrypt = require("bcrypt")
const authQueries = require("../db/queries/authQueries")
const verifyGoogleIdToken = require("../utils/verifyGoogleIdToken")

async function registerUser(data) {

  const { name, email, password, phone } = data

  const existingUser = await authQueries.findUserByEmail(email)

  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  

  const user = await authQueries.createUser(
    name,
    email,
    hashedPassword,
    phone
  )

  return user
}

async function loginUser(email, password) {

  const user = await authQueries.findUserByEmail(email)

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    throw new Error("Invalid credentials")
  }

  return user
}

async function loginResidentWithGoogle(idToken) {
  const payload = await verifyGoogleIdToken(idToken)
  const email = String(payload.email).toLowerCase()

  let user = await authQueries.findUserByEmail(email)

  if (user) {
    if (user.role !== "resident") {
      throw new Error("Google sign-in is only available for resident accounts")
    }

    return user
  }

  const generatedPasswordHash = await bcrypt.hash(
    `google:${payload.sub}`,
    10
  )

  user = await authQueries.createUser(
    payload.name || email.split("@")[0],
    email,
    generatedPasswordHash,
    null
  )

  return user
}

module.exports = {
  registerUser,
  loginUser,
  loginResidentWithGoogle
}
