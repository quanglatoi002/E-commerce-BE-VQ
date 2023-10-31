const mongoose = require("mongoose");

const bucketSchema = new mongoose.Schema({
    minPrice: Number,
    maxPrice: Number,
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

const Bucket = mongoose.model("Bucket", bucketSchema);
