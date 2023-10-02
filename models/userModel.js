const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        cart: {
            type: Array,
            default: [],
        },
        address: {
            type: String,
        },
        wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
        refreshToken: {
            type: String,
        },
        passwordChangeAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    // if no input password
    if (!this.isModified("password")) {
        next();
    }
    //create salt
    const salt = await bcrypt.genSaltSync(10);
    //hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//băm hash password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    //compare password + hash salt
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resettoken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    return resettoken;
};

//Export the model
module.exports = mongoose.model("User", userSchema);
