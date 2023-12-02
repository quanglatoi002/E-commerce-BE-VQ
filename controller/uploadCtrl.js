const fs = require("fs");
const asyncHandler = require("express-async-handler");

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const {
    updateImageFromLocalS3,
    deleteImageS3,
} = require("../services/upload.service");
const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const images = urls.map((file) => {
            return file;
        });
        res.json(images);
    } catch (error) {
        throw new Error(error);
    }
});
const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = cloudinaryDeleteImg(id, "images");
        res.json({ message: "Deleted" });
    } catch (error) {
        throw new Error(error);
    }
});

const uploadImageFromLocalS3 = asyncHandler(async (req, res) => {
    const { file } = req;
    // console.log(req.file);
    if (!file) {
        throw new BadRequestError("images missing");
    }
    new SuccessResponse({
        message: "upload successfully uploaded use S3Client",
        metadata: await updateImageFromLocalS3({ file }),
    }).send(res);
});

const deleteImageFromLocalS3 = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new BadRequestError("id missing");
    }
    new SuccessResponse({
        message: "delete successfully use S3Client",
        metadata: await deleteImageS3({ id }),
    }).send(res);
});

module.exports = {
    uploadImages,
    deleteImages,
    uploadImageFromLocalS3,
    deleteImageFromLocalS3,
};
