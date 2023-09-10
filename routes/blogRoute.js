const express = require("express");
const ctrlc = require("../controller/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/", [authMiddleware, isAdmin], ctrlc.createBlog);
router.put(
    "/upload/:id",
    [authMiddleware, isAdmin],
    uploadPhoto.array("images", 2),
    blogImgResize,
    ctrlc.uploadImages
);
router.put("/likes", [authMiddleware], ctrlc.likeBlog);
router.put("/dislikes", [authMiddleware], ctrlc.disLikeBlog);
router.get("/", ctrlc.getAllBlogs);
router.put("/:id", [authMiddleware, isAdmin], ctrlc.updateBlog);
router.get("/:id", ctrlc.getBlog);
router.delete("/:id", [authMiddleware, isAdmin], ctrlc.deleteBlog);
module.exports = router;
