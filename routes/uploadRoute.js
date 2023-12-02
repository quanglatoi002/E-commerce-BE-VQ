const express = require("express");
const {
    uploadImages,
    deleteImages,
    uploadImageFromLocalS3,
    deleteImageFromLocalS3,
} = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
    uploadPhoto,
    productImgResize,
    uploadS3,
} = require("../middlewares/uploadImages");

const router = express.Router();

router.post(
    "/",
    [authMiddleware, isAdmin],
    uploadPhoto.array("images", 10),
    productImgResize,
    uploadImages
);
router.post("/s3", uploadS3.single("file"), uploadImageFromLocalS3);

router.delete("/delete-imgs3/:id", deleteImageFromLocalS3);

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;
