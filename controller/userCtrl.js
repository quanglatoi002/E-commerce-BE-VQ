const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendMail = require("./emailCtrl");
const crypto = require("crypto");
const uniqid = require("uniqid");
const redis = require("redis");
const redisClient = redis.createClient();
// *validation client side

//create User
const createUser = asyncHandler(async (req, res) => {
    const email = req.body?.email;
    if (!email) throw new Error("Invalid email");
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // Tạo mới User
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        //User đã tồn tại
        throw new Error("User Already Exists");
    }
});

//login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check email before search data
    if (!email) throw new Error("Invalid email");
    //kiểm tra xem user có tồn tại hay ko?
    const findUser = await User.findOne({ email: email });
    //if search to info user then crypto password before input password
    // isPasswordMatched is the function then wait it
    if (findUser && (await findUser.isPasswordMatched(password))) {
        //create refresh token với _id user
        const refreshToken = await generateRefreshToken(findUser._id);
        // save refresh token in data
        await User?.findByIdAndUpdate(
            findUser._id,
            { refreshToken: refreshToken },
            { new: true }
        );
        // save refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

//login a admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) throw new Error("Invalid email");
    //kiểm tra xem user có tồn tại hay ko?
    const findAdmin = await User.findOne({ email: email });
    //check role
    if (findAdmin.role !== "admin") throw new Error("Not Authorized");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        await User?.findByIdAndUpdate(
            findAdmin._id,
            { refreshToken: refreshToken },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    console.log(req.cookies);
    // if expiry token then refresh token(expiry time)
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token In Cookie");
    // lấy ra refreshToken
    const refreshToken = cookie.refreshToken;
    // find user pass refreshToken take in cookie
    //check refreshToken ở data will refreshToken ở cookie
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh Token In Db");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        // sau khi verify token thì we will take _id the user và từ đó we create accessToken
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

//logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token In Cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(
        { refreshToken },
        {
            refreshToken: "",
        },
        { new: true }
    );
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
});

//get a update user

const updateaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updateaUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },
            { new: true }
        );
        res.json(updateaUser);
    } catch (error) {
        throw new Error(error);
    }
});

// save user Address

const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    if (!req?.body?.address) throw new Error("Please enter address");
    try {
        const updateaUser = await User.findByIdAndUpdate(
            _id,
            {
                address: req.body?.address,
            },
            { new: true }
        );
        res.json(updateaUser);
    } catch (error) {
        throw new Error(error);
    }
});

// get all users

const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

//get a single user

const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const getaUser = await User.findById(id);
        res.json(getaUser);
    } catch (error) {
        throw new Error(error);
    }
});

//get a delete user

const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const blockUser = await User.findByIdAndUpdate(
            id,
            { isBlocked: true },
            { new: true }
        );
        res.json(blockUser);
    } catch (error) {
        throw new Error(error);
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const unblockUser = await User.findByIdAndUpdate(
            id,
            { isBlocked: false },
            { new: true }
        );
        res.json({
            unblockUser,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    // nhận email khi user change password
    const { email } = req.body;
    // nếu user not input email then note miss email
    if (!email) throw new Error("Missing email");
    // có email thì tìm trg db email đó
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
        const resetToken = await user.createPasswordResetToken();
        console.log(resetToken);
        //nếu tự định nghĩa 1 method trong module thì ph save() lại vì dữ liệu trg đối tượng user đã thay đổi nhưng ch lưu lại vào cơ sở dữ liệu
        await user.save();

        const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn! Link này sẽ hết hạn trong 10 phút kể từ bây giờ <a href=${process.env.URL_CLIENT}/reset-password/${resetToken}>Click here</a>`;
        console.log(html);
        const data = {
            email,
            html,
        };
        const send = await sendMail(data);
        return res.json(send);
    } catch (error) {
        throw new Error(error);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    if (!password || !token) throw new Error("Missing inputs");
    // mã hóa token để trùng trong tìm kiếm db
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        // $gt: lớn hơn
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token Expired, Pls try again later");
    // cập nhật lại mật khẩu
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

//getWishlist

const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const findWishlist = await User.findById(_id).populate("wishlist");
        res.json(findWishlist);
    } catch (error) {
        throw new Error(error);
    }
});

//Cart

const userCart = asyncHandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body;
    console.log("a", req.body);
    //cart nhận giá trị là []
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        let newCart = await new Cart({
            userId: _id,
            productId,
            color,
            price,
            quantity,
            // sử dụng save() sẽ lưu đối tượng Cart({}) này vào cơ sở dữ liệu
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});

// lấy thông tin người dùng đã đặt hàng
const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.find({ userId: _id })
            .populate("productId")
            .populate("color");
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    validateMongoDbId(_id);
    try {
        const deleteCart = await Cart.deleteOne({
            userId: _id,
            _id: cartItemId,
        });
        if (deleteCart?.deletedCount === 1) {
            // Trả về thông tin của sản phẩm đã xóa
            res.json({ deletedProductId: cartItemId });
        } else {
            // Trường hợp không tìm thấy hoặc xóa không thành công
            res.status(404).json({
                message: "Product not found or deletion failed",
            });
        }
    } catch (error) {
        throw new Error(error);
    }
});

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const deleteCart = await Cart.deleteMany({
            userId: _id,
        });
        res.json(deleteCart);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId, newQuantity } = req.params;
    validateMongoDbId(_id);
    try {
        const cartItem = await Cart.findOne({
            userId: _id,
            _id: cartItemId,
        });
        cartItem.quantity = newQuantity;
        cartItem.save();
        res.json(cartItem);
    } catch (error) {
        throw new Error(error);
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const {
        shoppingInfo,
        cartProductState,
        totalPrice,
        totalPriceAfterDiscount,
        paymentInfo,
    } = req.body;
    console.log(req.body.shoppingInfo);
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        const order = await Order.create({
            user: _id,
            shippingInfo: shoppingInfo,
            orderItems: cartProductState,
            totalPrice,
            totalPriceAfterDiscount,
            paymentInfo,
        });
        console.log("order 123", order);

        if (!order) throw new Error("Order not created");
        // publish để bên admin nhận info
        redisClient.publish(
            "newOrder",
            JSON.stringify({
                name:
                    order.shippingInfo.firstName +
                    " " +
                    order.shippingInfo.lastName,
            })
        );

        res.json({
            order,
            success: true,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        const orders = await Order.find({ user: _id }).populate(
            "orderItems.product"
        );
        res.json({ orders });
    } catch (error) {
        throw new Error(error);
    }
});

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        console.log(req.user);
        const orders = await Order.find().populate("user");
        res.json({ orders });
    } catch (error) {
        throw new Error(error);
    }
});

const getSingleOrders = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const orders = await Order.findOne({ _id: id })
            .populate("orderItems.product")
            .populate("orderItems.color");
        res.json({ orders });
    } catch (error) {
        throw new Error(error);
    }
});

const updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const orders = await Order.findById(id);
        orders.orderStatus = req.body.orderStatus;
        await orders.save();
        res.json({ orders });
    } catch (error) {
        throw new Error(error);
    }
});

const getMontWiseOrderIncome = asyncHandler(async (req, res) => {
    var mL = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    let d = new Date();
    let endDate = "";
    d.setDate(1);
    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() - 1);
        endDate = mL[d.getMonth()] + " " + d.getFullYear();
        console.log(endDate);
    }

    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate),
                },
            },
        },
        {
            $group: {
                _id: {
                    month: "$month",
                },
                amount: { $sum: "$totalPriceAfterDiscount" },
                count: { $sum: 1 },
            },
        },
    ]);
    res.json(data);
});

const getYearlyTotalOrders = asyncHandler(async (req, res) => {
    let mL = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    let d = new Date();
    let endDate = "";
    d.setDate(1);
    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() - 1);
        endDate = mL[d.getMonth()] + " " + d.getFullYear();
        console.log(endDate);
    }

    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate),
                },
            },
        },
        {
            $group: {
                _id: null,
                count: { $sum: 1 },
                amount: { $sum: "$totalPriceAfterDiscount" },
            },
        },
    ]);
    res.json(data);
});

module.exports = {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteaUser,
    updateaUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    removeProductFromCart,
    updateProductQuantityFromCart,
    createOrder,
    getMyOrders,
    getMontWiseOrderIncome,
    getYearlyTotalOrders,
    getAllOrders,
    getSingleOrders,
    updateOrder,
    emptyCart,
};
