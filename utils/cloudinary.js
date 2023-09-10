const cloudinary = require("cloudinary");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const cloudinaryUploadImg = async (fileToUpload) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUpload, (result) => {
            resolve(
                {
                    url: result?.secure_url,
                },
                {
                    resource_type: "auto",
                }
            );
        });
    });
};

module.exports = cloudinaryUploadImg;
