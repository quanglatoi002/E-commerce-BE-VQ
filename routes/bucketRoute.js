const express = require("express");
const ctrlc = require("../controller/bucketCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
    "/create-buckets",
    [authMiddleware, isAdmin],
    ctrlc.createProductBuckets
);
module.exports = router;
