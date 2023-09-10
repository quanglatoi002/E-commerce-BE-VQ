const express = require("express");
const ctrlc = require("../controller/productCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
    uploadPhoto,
    productImgResize,
} = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/", [authMiddleware, isAdmin], ctrlc.createProduct);
router.put(
    "/upload",
    [authMiddleware, isAdmin],
    uploadPhoto.array("images", 10),
    productImgResize,
    ctrlc.uploadImages
);
router.get("/", ctrlc.getAllProduct);
router.put("/wishlist", [authMiddleware, isAdmin], ctrlc.addToWishlist);
router.put("/rating", [authMiddleware, isAdmin], ctrlc.ratings);
router.delete("/delete-img/:id", [authMiddleware, isAdmin], ctrlc.deleteImages);
router.get("/:id", ctrlc.getaProduct);
router.put("/:id", [authMiddleware, isAdmin], ctrlc.updateProduct);
router.delete("/:id", [authMiddleware, isAdmin], ctrlc.deleteProduct);

module.exports = router;
