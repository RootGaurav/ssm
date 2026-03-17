const notificationService = require("../services/notificationService")

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

const createNotification = async (req, res) => {

  try {

    const notification = await notificationService.createNotification(req.body)

    res.status(201).json(notification)

  } catch (error) {

    res.status(400).json({
      error: error.message
    })

  }

}

module.exports = {
  getNotifications,
  createNotification
}