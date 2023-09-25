const express = require("express");
const ctrlc = require("../controller/prodCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", [authMiddleware, isAdmin], ctrlc.createCategory);
router.get("/", ctrlc.getAllCategory);
router.put("/:id", [authMiddleware, isAdmin], ctrlc.updateCategory);
router.delete("/:id", [authMiddleware, isAdmin], ctrlc.deleteCategory);
router.get("/:id", [authMiddleware, isAdmin], ctrlc.getCategory);

module.exports = router;
