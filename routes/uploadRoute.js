const express = require("express");
const {
    uploadImages,
    deleteImages,
    uploadImageFromLocalS3,
} = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
    uploadPhoto,
    productImgResize,
} = require("../middlewares/uploadImages");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// router.post(
//     "/",
//     [authMiddleware, isAdmin],
//     uploadPhoto.array("images", 10),
//     productImgResize,
//     uploadImages
// );
router.post("/", upload.single("file"), uploadImageFromLocalS3);

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;
