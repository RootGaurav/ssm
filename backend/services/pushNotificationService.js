const axios = require("axios")

const sendPushNotification = async (title, message) => {

  try {

    await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: process.env.ONESIGNAL_APP_ID,

        included_segments: ["All"],

        headings: {
          en: title
        },

        contents: {
          en: message
        }

      },
      {
        headers: {
          Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

  } catch (error) {

    console.error(
      "Push Notification Error:",
      error.response?.data
    )

  }

}

module.exports = {
  sendPushNotification
}