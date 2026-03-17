const bcrypt = require("bcrypt")
const authQueries = require("../db/queries/authQueries")

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

module.exports = {
  registerUser,
  loginUser
}