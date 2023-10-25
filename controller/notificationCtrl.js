const Notification = require("../models/notificationModel");

const sendNotification = async (message) => {
    const notification = new Notification({
        message,
    });
    await notification.save();
    return notification;
};

module.exports = {
    sendNotification,
};
