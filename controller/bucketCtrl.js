const Bucket = require("../models/bucketModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const createProductBuckets = asyncHandler(async (req, res) => {
    const minPrice = 0;
    const maxPrice = 5000; // Giả sử giá sản phẩm từ 0 đến 1000
    const numberOfBuckets = 10; // Số lượng bucket (khoảng giá) bạn muốn chia dữ liệu thành
    const bucketSize = (maxPrice - minPrice) / numberOfBuckets;
    try {
        // = 0 + 0 * 100 => min = 0
        // = 0 + 1 * 100 => min = 100
        // = 0 + 2 * 100 => max = 200
        for (let i = 0; i < numberOfBuckets; i++) {
            const bucketMinPrice = minPrice + i * bucketSize;
            const bucketMaxPrice = minPrice + (i + 1) * bucketSize;

            //find những tk có  price nằm trg khoảng đó
            const productsInBucket = await Product.find({
                price: { $gte: bucketMinPrice, $lt: bucketMaxPrice },
            });

            // Lưu trữ ObjectId của sản phẩm vào bucket tương ứng
            // lấy ra id của từng sp
            const productIds = productsInBucket.map((product) => product._id);
            // bucket pattern
            await Bucket.create({
                minPrice: bucketMinPrice,
                maxPrice: bucketMaxPrice,
                products: productIds,
            });
        }
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createProductBuckets,
};
