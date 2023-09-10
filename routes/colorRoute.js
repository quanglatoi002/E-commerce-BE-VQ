const express = require("express");
const ctrlc = require("../controller/colorCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", [authMiddleware, isAdmin], ctrlc.createColor);
router.get("/", [authMiddleware, isAdmin], ctrlc.getAllColor);
router.put("/:id", [authMiddleware, isAdmin], ctrlc.updateColor);
router.delete("/:id", [authMiddleware, isAdmin], ctrlc.deleteColor);
router.get("/:id", ctrlc.getColor);

module.exports = router;
