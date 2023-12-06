const Notification = require("../models/notificationModel");
const asyncHandler = require("express-async-handler");

const sendNotification = async (message) => {
    try {
        const notification = new Notification({
            message,
        });
        await notification.save();
        return notification;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getNotifications = asyncHandler(async (req, res) => {
    try {
        const getAllNotification = await Notification.find();

        if (!getAllNotification) throw new Error("Not Found Notifications");

        res.json(getAllNotification);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    sendNotification,
    getNotifications,
};
