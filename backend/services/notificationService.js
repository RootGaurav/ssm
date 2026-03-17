const notificationQueries = require("../db/queries/notificationQueries")

const getNotifications = async () => {
  return await notificationQueries.getNotifications()
}

const createNotification = async (data) => {

  const { title, message, target_type } = data

  if (!title || !message) {
    throw new Error("Title and message are required.")
  }

  if (!["all","flat","resident"].includes(target_type)) {
    throw new Error("Invalid notification target.")
  }

  return await notificationQueries.createNotification(data)
}

module.exports = {
  getNotifications,
  createNotification
}