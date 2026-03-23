const { createRemoteJWKSet, jwtVerify } = require("jose")

const googleJwks = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
)

async function verifyGoogleIdToken(idToken) {
  if (!idToken) {
    throw new Error("Google token is required")
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Google login is not configured on the server")
  }

  const { payload } = await jwtVerify(idToken, googleJwks, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  if (!payload.email || !payload.email_verified) {
    throw new Error("Google account email is not verified")
  }

  return payload
}

module.exports = verifyGoogleIdToken
