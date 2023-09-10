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

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
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
    //kiểm tra xem user có tồn tại hay ko?
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser._id);
        await User?.findByIdAndUpdate(
            findUser._id,
            { refreshToken: refreshToken },
            { new: true }
        );
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
    //kiểm tra xem user có tồn tại hay ko?
    const findAdmin = await User.findOne({ email });
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
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token In Cookie");
    const refreshToken = cookie.refreshToken;
    // console.log(refreshToken);
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh Token In Db");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
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
    try {
        const updateaUser = await User.findByIdAndUpdate(
            _id,
            {
                address: req?.body?.address,
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
        res.json({
            getaUser,
        });
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
    const { email } = req.query;
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

        const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn! Link này sẽ hết hạn trong 10 phút kể từ bây giờ <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;
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
    const { _id } = req.user;
    const { cart } = req.body;
    validateMongoDbId(_id);
    try {
        let products = [];
        const user = await User.findById(_id);
        //kiểm tra xem ng đã có product in cart ko?
        const alreadyExistsCart = await Cart.findOne({ orderBy: user?._id });
        if (alreadyExistsCart) {
            alreadyExistsCart.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById({ _id: cart[i]._id })
                .select("price")
                .exec();
            object.price = getPrice?.price;
            products.push(object);
        }
        let carTotal = 0;
        for (let i = 0; i < products.length; i++) {
            carTotal += products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal: carTotal,
            orderBy: user?._id,
            // sử dụng save() sẽ lưu đối tượng Cart({}) này vào cơ sở dữ liệu
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.findOne({ orderBy: _id }).populate(
            "products.product"
        );
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findOne(_id);
        const cart = await Cart.findOneAndRemove({ orderBy: user?._id });
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const applyCoupon = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    const { coupon } = req.body;
    try {
        const validCoupon = await Coupon.findOne({ name: coupon });
        if (validCoupon === null) throw new Error("Coupon not found");
        const user = await User.findOne(_id);
        let { cartTotal } = await Cart.findOne({
            orderBy: user._id,
        }).populate("products.product");
        // giá tiền được giảm khi áp dụng discount
        let totalAfterDiscount = (
            cartTotal -
            (cartTotal * validCoupon.discount) / 100
        ).toFixed(2);
        await Cart.findOneAndUpdate({ orderBy: user._id }, totalAfterDiscount, {
            new: true,
        });
        res.json(totalAfterDiscount);
    } catch (error) {
        throw new Error(error);
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        if (!COD) throw new Error("Create cash order failed");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderBy: user._id });
        let finalAmount = 0;
        if (couponApplied && userCart?.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderBy: user._id,
            orderStatus: "Cash on Delivery",
        }).save();
        let update = userCart?.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: {
                        $inc: { quantity: -item.count, sold: +item.count },
                    },
                },
            };
        });
        const updated = await Product.bulkWrite(update, {});
        res.json({ message: "success" });
    } catch (error) {
        throw new Error(error);
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const userOrders = await Order.findOne({ orderBy: _id })
            .populate("products.product")
            .exec();
        res.json(userOrders);
    } catch (error) {
        throw new Error(error);
    }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            },
            { new: true }
        );
        res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error);
    }
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
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
};
