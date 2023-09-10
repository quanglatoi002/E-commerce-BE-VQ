const express = require("express");
const ctrlc = require("../controller/enqCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", ctrlc.createEnquiry);
router.get("/", [authMiddleware, isAdmin], ctrlc.getAllEnquiry);
router.put("/:id", [authMiddleware, isAdmin], ctrlc.updateEnquiry);
router.delete("/:id", [authMiddleware, isAdmin], ctrlc.deleteEnquiry);
router.get("/:id", ctrlc.getEnquiry);

module.exports = router;
