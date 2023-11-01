const mongoose = require("mongoose"); // Erase if already required
const { collection } = require("./userModel");

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        sold: {
            type: Number,
            default: 0,
        },
        images: [{ public_id: String, url: String }],
        tags: {
            type: String,
            required: true,
        },
        color: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Color",
            },
        ],
        ratings: [
            {
                star: Number,
                comment: String,
                postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
            },
        ],
        totalRatings: {
            type: String,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);

// ví dụ cho trường hợp xây dựng nhiều sản phẩm khác nhau với nhiều trường dữ liệu ko đồng nhất

const product = new mongoose.Schema(
    {
        productId: { type: Number, required: true },
        code: String,
        name: String,
        brand: String,
        description: String,
        release_data: Date,
        //cách 1
        //Nếu bạn cần độ linh hoạt cao và định rõ cấu trúc dữ liệu, cách 1 có thể phù hợp hơn.
        specs: [
            {
                k: String, // Key
                v: mongoose.Schema.Types.Mixed, // Value (có thể là bất kỳ kiểu dữ liệu nào)
            },
        ],
        //cách 2
        //Nếu bạn cần độ linh hoạt cao và định rõ cấu trúc dữ liệu, cách 1 có thể phù hợp hơn.
        specs: {
            type: Array,
            default: [],
        },
    },
    {
        collection: "products",
        timestamps: true,
    }
);
