const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                },
                count: Number,
                color: String,
                price: Number,
            },
        ],
        cartTotal: Number,
        totalAfterDiscount: Number,
        orderBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model("Cart", cartSchema);
