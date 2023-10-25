const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    message: String,
    timestamp: {
        type: Date,
        default: Date.now(),
    },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
