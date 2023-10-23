const express = require("express");
const ctrlc = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { checkout, paymentVerification } = require("../controller/paymentCtrl");
const router = express.Router();
const {
    requestLimitMiddleware,
} = require("../middlewares/requestLimitMiddleware");

router.post("/register", ctrlc.createUser);
router.post("/forgot-password-token", ctrlc.forgotPasswordToken);
router.post("/cart/create-order", [authMiddleware], ctrlc.createOrder);
router.put("/reset-password/:token", ctrlc.resetPassword);
router.put("/password", [authMiddleware], ctrlc.updatePassword);

router.post("/login", ctrlc.loginUserCtrl);
router.post("/admin-login", ctrlc.loginAdmin);
router.post("/cart/create-order", [authMiddleware], ctrlc.createOrder);
router.post("/cart", [authMiddleware], ctrlc.userCart);
router.get(
    "/getMonthWiseOrderIncome",
    [authMiddleware],
    ctrlc.getMontWiseOrderIncome
);
router.get(
    "/getYearlyTotalOrders",
    [authMiddleware],
    ctrlc.getYearlyTotalOrders
);
router.post("/order/checkout", authMiddleware, checkout);
router.post("/order/paymentVerification", authMiddleware, paymentVerification);

router.get("/all-users", ctrlc.getallUser);
router.get("/get-myorders", [authMiddleware], ctrlc.getMyOrders);
router.get("/getall-orders", [authMiddleware], ctrlc.getAllOrders);

router.get("/refresh", ctrlc.handleRefreshToken);
router.get("/logout", [authMiddleware], ctrlc.logout);
router.get("/wishlist", [authMiddleware], ctrlc.getWishlist);
router.get("/cart", [authMiddleware], ctrlc.getUserCart);
router.delete("/empty-cart", [authMiddleware], ctrlc.emptyCart);

router.put("/save-address", [authMiddleware], ctrlc.saveAddress);
router.put("/edit-user", [authMiddleware], ctrlc.updateaUser);
//test user yêu cầu req quá nhiu
router.get(
    "/:id",
    [authMiddleware, isAdmin, requestLimitMiddleware],
    ctrlc.getaUser
);
router.get("/getAOrder/:id", [authMiddleware, isAdmin], ctrlc.getSingleOrders);
router.put("/updateOrder/:id", [authMiddleware, isAdmin], ctrlc.updateOrder);
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
