const express = require("express");
const ctrlc = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", [authMiddleware, isAdmin], ctrlc.createCoupon);
router.get("/", [authMiddleware, isAdmin], ctrlc.getAllCoupons);
router.put("/:id", [authMiddleware, isAdmin], ctrlc.updateCoupon);
router.delete("/:id", [authMiddleware, isAdmin], ctrlc.deleteCoupon);

module.exports = router;
