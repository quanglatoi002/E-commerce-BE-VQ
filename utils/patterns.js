const Product = require("../models/productModel");

class DatabaseFacade {
    static async getProductById(id) {
        // Logic để lấy sản phẩm từ MongoDB
        return await Product.findById(id).populate("color");
    }

    static async createProduct(productData) {
        // Logic để tạo sản phẩm trong MongoDB
        const newProduct = new Product(productData);
        return await newProduct.save();
    }
}

module.exports = DatabaseFacade;
