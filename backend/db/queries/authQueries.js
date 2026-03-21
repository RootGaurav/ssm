const pool = require("../db")

const syncUsersSequence = async (client) => {
  await client.query(
    `
    SELECT setval(
      pg_get_serial_sequence('users', 'id'),
      COALESCE((SELECT MAX(id) FROM users), 0) + 1,
      false
    )
    `
  )
}

async function createUser(name, email, password, phone) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    await syncUsersSequence(client)

    const query = `
      INSERT INTO users(name,email,password,phone,role)
      VALUES($1,$2,$3,$4,'resident')
      RETURNING id,name,email,role
    `

    const values = [name, email, password, phone]
    const result = await client.query(query, values)

    await client.query("COMMIT")
    return result.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
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
