const bcrypt = require("bcryptjs")
const queries = require("../db/queries/profileQueries")

const getProfile = async (userId) => {

  const user = await queries.getProfile(userId)

  if (!user) {
    throw new Error("User not found")
  }

  return user
}

const updateProfile = async (userId, data) => {

  const { name, phone } = data

  if (!name || !phone) {
    throw new Error("Name and phone are required")
  }

  const user = await queries.updateProfile(userId, { name, phone })

  if (!user) {
    throw new Error("Failed to update profile")
  }

  return user
}

const changePassword = async (userId, data) => {

  const { oldPassword, newPassword } = data

  if (!oldPassword || !newPassword) {
    throw new Error("Both passwords are required")
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long")
  }

  // GET CURRENT PASSWORD
  const user = await queries.getPasswordById(userId)

  if (!user) {
    throw new Error("User not found")
  }

  // VERIFY OLD PASSWORD
  const isMatch = await bcrypt.compare(
    oldPassword,
    user.password
  )

  if (!isMatch) {
    throw new Error("Old password is incorrect")
  }

  // HASH NEW PASSWORD
  const hash = await bcrypt.hash(newPassword, 10)

  await queries.changePassword(userId, hash)

  return { message: "Password updated successfully" }

}

module.exports = {
  getProfile,
  updateProfile,
  changePassword
}