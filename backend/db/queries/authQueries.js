const pool = require("../db")

async function createUser(name, email, password, phone) {

  const query = `
    INSERT INTO users(name,email,password,phone,role)
    VALUES($1,$2,$3,$4,'resident')
    RETURNING id,name,email,role
  `

  const values = [name, email, password, phone]

  const result = await pool.query(query, values)

  return result.rows[0]
}

async function findUserByEmail(email) {

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  )

  return result.rows[0]
}

module.exports = {
  createUser,
  findUserByEmail
}