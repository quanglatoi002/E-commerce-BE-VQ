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
                    asset_id: result?.asset_id,
                    public_id: result?.public_id,
                },
                {
                    resource_type: "auto",
                }
            );
        });
    });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(fileToDelete, (result) => {
            resolve(
                {
                    url: result?.secure_url,
                    asset_id: result?.asset_id,
                    public_id: result?.public_id,
                },
                {
                    resource_type: "auto",
                }
            );
        });
    });
};

module.exports = {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
};
