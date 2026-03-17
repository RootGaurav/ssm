const pool = require("../db")

const getProfile = async (userId) => {

  const result = await pool.query(
    `
    SELECT id, name, email, phone, role
    FROM users
    WHERE id=$1
    `,
    [userId]
  )

  return result.rows[0]
}


const updateProfile = async (userId,data) => {

  const { name, phone } = data

  const result = await pool.query(
    `
    UPDATE users
    SET name=$1, phone=$2
    WHERE id=$3
    RETURNING id,name,email,phone
    `,
    [name, phone, userId]
  )

  return result.rows[0]

}


const getPasswordById = async (userId) => {

  const result = await pool.query(
    `
    SELECT password
    FROM users
    WHERE id=$1
    `,
    [userId]
  )

  return result.rows[0]

}

const changePassword = async (userId,passwordHash) => {

  await pool.query(
    `
    UPDATE users
    SET password=$1
    WHERE id=$2
    `,
    [passwordHash,userId]
  )

}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getPasswordById
}