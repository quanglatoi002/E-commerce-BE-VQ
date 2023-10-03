const express = require("express");
const ctrlc = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { checkout, paymentVerification } = require("../controller/paymentCtrl");
const router = express.Router();

router.post("/register", ctrlc.createUser);
router.post("/forgot-password-token", ctrlc.forgotPasswordToken);
router.post("/cart/create-order", [authMiddleware], ctrlc.createOrder);
router.put("/reset-password/:token", ctrlc.resetPassword);
router.put("/password", [authMiddleware], ctrlc.updatePassword);
// router.put(
//     "/order/update-order/:id",
//     [authMiddleware, isAdmin],
//     ctrlc.updateOrderStatus
// );
router.post("/login", ctrlc.loginUserCtrl);
router.post("/admin-login", ctrlc.loginAdmin);
// router.post("/cart/apply-coupon", [authMiddleware], ctrlc.applyCoupon);
router.post("/cart/create-order", [authMiddleware], ctrlc.createOrder);
router.post("/cart", [authMiddleware], ctrlc.userCart);
router.post("/order/checkout", authMiddleware, checkout);
router.post("/order/paymentVerification", authMiddleware, paymentVerification);

router.get("/all-users", ctrlc.getallUser);
// router.get("/get-orders", [authMiddleware], ctrlc.getOrders);
// router.get("/getall-orders", [authMiddleware, isAdmin], ctrlc.getAllOrders);

router.get("/refresh", ctrlc.handleRefreshToken);
router.get("/logout", [authMiddleware], ctrlc.logout);
router.get("/wishlist", [authMiddleware], ctrlc.getWishlist);
router.get("/cart", [authMiddleware], ctrlc.getUserCart);
// router.delete("/empty-cart", [authMiddleware], ctrlc.emptyCart);

router.put("/save-address", [authMiddleware], ctrlc.saveAddress);
router.put("/edit-user", [authMiddleware], ctrlc.updateaUser);

router.get("/:id", [authMiddleware, isAdmin], ctrlc.getaUser);
// router.post("/getorderbyuser/:id", ctrlc.getOrderByUserId);
router.delete("/:id", ctrlc.deleteaUser);
router.delete(
    "/delete-product-cart/:cartItemId",
    [authMiddleware],
    ctrlc.removeProductFromCart
);
router.delete(
    "/update-product-cart/:cartItemId/:newQuantity",
    [authMiddleware],
    ctrlc.updateProductQuantityFromCart
);
router.put("/block-user/:id", [authMiddleware, isAdmin], ctrlc.blockUser);
router.put("/unblock-user/:id", [authMiddleware, isAdmin], ctrlc.unblockUser);

module.exports = router;
