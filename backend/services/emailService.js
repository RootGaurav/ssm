const nodemailer = require("nodemailer")

let transporterPromise = null

const isEmailConfigured = () => {
  return Boolean(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_PORT &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_FROM
  )
}

const getTransporter = async () => {
  if (!isEmailConfigured()) {
    return null
  }

  if (!transporterPromise) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    )
  }

  return transporterPromise
}

const sendNotificationEmails = async ({ recipients, title, message }) => {
  const uniqueRecipients = [...new Set(
    recipients
      .map((email) => typeof email === "string" ? email.trim().toLowerCase() : "")
      .filter(Boolean)
  )]

  if (!uniqueRecipients.length) {
    return {
      configured: isEmailConfigured(),
      attempted: 0,
      sent: 0,
      skipped: 0,
    }
  }

  const transporter = await getTransporter()

  if (!transporter) {
    return {
      configured: false,
      attempted: uniqueRecipients.length,
      sent: 0,
      skipped: uniqueRecipients.length,
    }
  }

  let sent = 0

  for (const email of uniqueRecipients) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: title,
        text: message,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
            <h2 style="margin: 0 0 12px; color: #166534;">${title}</h2>
            <p style="margin: 0; color: #374151; line-height: 1.6;">${message}</p>
          </div>
        `,
      })
      sent += 1
    } catch (error) {
      console.error(`Failed to send notification email to ${email}:`, error.message)
    }
  }

  return {
    configured: true,
    attempted: uniqueRecipients.length,
    sent,
    skipped: uniqueRecipients.length - sent,
  }
}

module.exports = {
  isEmailConfigured,
  sendNotificationEmails,
}
