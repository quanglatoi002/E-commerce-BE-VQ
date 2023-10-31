const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Tham chiếu đến schema của User
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Tham chiếu đến schema của Product
        required: true,
    },
    star: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
