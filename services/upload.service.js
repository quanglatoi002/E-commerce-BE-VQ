"use strict";

const {
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} = require("../config/s3.config");
const crypto = require("crypto");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const urlImagePublic = process.env.AWS_CLOUD_FRONT;
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const sharp = require("sharp");

const randomImageName = () => crypto.randomBytes(16).toString("hex");
const imageName = randomImageName();

const updateImageFromLocalS3 = async ({ file }) => {
    try {
        const buffer = await sharp(file.buffer)
            .resize({
                height: 300,
                width: 300,
                fit: "contain",
            })
            .toBuffer();
        // start update image up s3
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: buffer,
            ContentType: "image/jpeg",
        });
        const result = await s3.send(command);
        //end update

        //start public link image out community
        const url = getSignedUrl({
            url: `${urlImagePublic}/${imageName}`,
            keyPairId: process.env.AWS_PUBLIC_KEY_ID_CLOUD_FRONT,
            dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24),
            privateKey: process.env.AWS_BUCKET_PUBLIC_KEY_ID,
        });

        return {
            url,
            result,
        };
    } catch (error) {
        console.error("Error uploading image use S3Client::", error);
    }
};

const deleteImageS3 = async ({ id }) => {
    try {
        // start update image up s3
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
        });
        const result = await s3.send(command);
        return {
            result,
        };
    } catch (error) {
        console.error("Error delete image use S3Client::", error);
    }
};

module.exports = {
    updateImageFromLocalS3,
    deleteImageS3,
};
