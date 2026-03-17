const notificationService = require("../services/notificationService")

// GET NOTIFICATIONS
const getNotifications = async (req, res) => {

  try {

    const notifications = await notificationService.getNotifications()

    res.json(notifications)

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch notifications"
    })

  }

}


// CREATE NOTIFICATION
const createNotification = async (req, res) => {

  try {

    const notification = await notificationService.createNotification(req.body)

    res.status(201).json(notification)

  } catch (error) {

    res.status(500).json({
      error: "Failed to create notification"
    })

  }

}

module.exports = {
  getNotifications,
  createNotification
}