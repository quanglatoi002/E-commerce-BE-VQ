const express = require("express");
const ctrlc = require("../controller/brandCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", [authMiddleware, isAdmin], ctrlc.createBrand);
router.get("/", ctrlc.getAllBrand);
router.put("/:id", [authMiddleware, isAdmin], ctrlc.updateBrand);
router.delete("/:id", [authMiddleware, isAdmin], ctrlc.deleteBrand);
router.get("/:id", [authMiddleware, isAdmin], ctrlc.getBrand);

module.exports = router;
