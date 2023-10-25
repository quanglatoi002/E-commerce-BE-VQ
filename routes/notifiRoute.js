const express = require("express");
const ctrlc = require("../controller/notificationCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/send-notification", async (req, res) => {
    const { message } = req.body;
    try {
        const notification = await notificationController.sendNotification(
            message
        );
        res.json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
