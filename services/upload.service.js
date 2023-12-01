"use strict";

const { s3, PutObjectCommand } = require("../config/s3.config");
const crypto = require("crypto");
const updateImageFromLocalS3 = async ({ file }) => {
    try {
        const randomImageName = () => crypto.randomBytes(16).toString("hex");
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: randomImageName() || "unknown",
            Body: file.buffer,
            ContentType: "image/jpeg",
        });

        const result = await s3.send(command);
        return result;
        // return {
        //     images_url,
        //     shopId,
        //     thumb_url: aw,
        // };
    } catch (error) {
        console.error("Error uploading image use S3Client::", error);
    }
};

module.exports = updateImageFromLocalS3;
