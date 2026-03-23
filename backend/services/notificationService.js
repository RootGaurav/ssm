const notificationQueries = require("../db/queries/notificationQueries")
const emailService = require("./emailService")

const getNotifications = async () => {
  return await notificationQueries.getNotifications()
}

const createNotification = async (data) => {

  const { title, message, target_type, flat_id, user_id } = data

  if (!title || !message) {
    throw new Error("Title and message are required.")
  }

  if (!["all","flat","resident"].includes(target_type)) {
    throw new Error("Invalid notification target.")
  }

  if (target_type === "flat" && !flat_id) {
    throw new Error("Flat is required for flat notifications.")
  }

  if (target_type === "resident" && !user_id) {
    throw new Error("Resident is required for resident notifications.")
  }

  const notification = await notificationQueries.createNotification(data)

  let recipients = []

  if (target_type === "all") {
    recipients = await notificationQueries.getEmailsForAllResidents()
  } else if (target_type === "flat") {
    recipients = await notificationQueries.getEmailsForFlat(flat_id)
  } else if (target_type === "resident") {
    recipients = await notificationQueries.getEmailsForResident(user_id)
  }

  const emailSummary = await emailService.sendNotificationEmails({
    recipients,
    title,
    message,
  })

  return {
    notification,
    emailSummary,
  }
}

module.exports = {
  getNotifications,
  createNotification
}
