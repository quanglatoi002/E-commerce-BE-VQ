const express = require("express");
const ctrlc = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", ctrlc.createUser);
router.post("/forgot-password-token", ctrlc.forgotPasswordToken);
router.put("/reset-password/:token", ctrlc.resetPassword);
router.put("/password", [authMiddleware], ctrlc.updatePassword);
router.put(
    "/order/update-order/:id",
    [authMiddleware, isAdmin],
    ctrlc.updateOrderStatus
);
router.post("/login", ctrlc.loginUserCtrl);
router.post("/admin-login", ctrlc.loginAdmin);
router.post("/cart/apply-coupon", [authMiddleware], ctrlc.applyCoupon);
router.post("/cart/cash-order", [authMiddleware], ctrlc.createOrder);
router.post("/cart", [authMiddleware], ctrlc.userCart);
router.get("/all-users", ctrlc.getallUser);
router.get("/get-orders", [authMiddleware], ctrlc.getOrders);
router.get("/refresh", ctrlc.handleRefreshToken);
router.get("/logout", [authMiddleware], ctrlc.logout);
router.get("/wishlist", [authMiddleware], ctrlc.getWishlist);
router.get("/cart", [authMiddleware], ctrlc.getUserCart);
router.delete("/empty-cart", [authMiddleware], ctrlc.emptyCart);
router.put("/save-address", [authMiddleware], ctrlc.saveAddress);
router.put("/edit-user", [authMiddleware], ctrlc.updateaUser);

router.get("/:id", [authMiddleware, isAdmin], ctrlc.getaUser);
router.delete("/:id", ctrlc.deleteaUser);

router.put("/block-user/:id", [authMiddleware, isAdmin], ctrlc.blockUser);
router.put("/unblock-user/:id", [authMiddleware, isAdmin], ctrlc.unblockUser);

module.exports = router;
