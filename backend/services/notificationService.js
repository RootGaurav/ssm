const notificationQueries = require("../db/queries/notificationQueries")

const getNotifications = async () => {
  return await notificationQueries.getNotifications()
}

const createNotification = async (data) => {
  return await notificationQueries.createNotification(data)
}

module.exports = {
  getNotifications,
  createNotification
}