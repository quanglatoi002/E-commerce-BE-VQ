const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var nonceSchema = new mongoose.Schema({
    nonce: String,
    timestamp: Number,
});

//Export the model
module.exports = mongoose.model("Nonce", nonceSchema);
