const authService = require("../services/authService")
const generateToken = require("../utils/generateToken")

async function register(req, res) {

  try {

    const user = await authService.registerUser(req.body)

    const token = generateToken(user)

    res.json({
      user,
      token
    })

  } catch (error) {

    res.status(400).json({
      error: error.message
    })

  }

}

async function login(req, res) {

  try {

    const { email, password } = req.body

    const user = await authService.loginUser(email, password)

    const token = generateToken(user)

    res.json({
      user,
      token
    })

  } catch (error) {

    res.status(401).json({
      error: error.message
    })

  }

}

async function googleResidentLogin(req, res) {

  try {

    const { idToken } = req.body

    const user = await authService.loginResidentWithGoogle(idToken)

    const token = generateToken(user)

    res.json({
      user,
      token
    })

  } catch (error) {

    res.status(401).json({
      error: error.message
    })

  }

}

module.exports = {
  register,
  login,
  googleResidentLogin
}
