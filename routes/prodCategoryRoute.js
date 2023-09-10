const express = require("express");
const ctrlc = require("../controller/prodCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", [authMiddleware, isAdmin], ctrlc.createCategory);
router.get("/", [authMiddleware, isAdmin], ctrlc.getAllCategory);
router.put("/:id", [authMiddleware, isAdmin], ctrlc.updateCategory);
router.delete("/:id", [authMiddleware, isAdmin], ctrlc.deleteCategory);
router.get("/:id", ctrlc.getCategory);

module.exports = router;
