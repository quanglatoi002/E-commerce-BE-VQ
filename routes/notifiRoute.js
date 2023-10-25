const express = require("express");
const ctrlc = require("../controller/notificationCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();

router.post("/", async (req, res) => {
    //đợi admin gửi message
    const { message } = req.body;
    try {
        const savedNotification = await ctrlc.sendNotification(message);
        client.publish("notifications", JSON.stringify({ message }));
        res.json({ success: true, savedNotification });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
