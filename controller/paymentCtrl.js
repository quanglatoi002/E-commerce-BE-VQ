const Razarpay = require("razorpay");

const instance = new Razarpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

const checkout = async (req, res) => {
    const { amount } = req.body;
    const option = {
        amount: amount * 100 + 5,
        currency: "INR",
        receipt: "receipt_order_74394",
    };
    const order = await instance.orders.create(option);
    res.json({
        success: true,
        order,
    });
};

const paymentVerification = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId } = req.body;
    res.json({
        razorpayOrderId,
        razorpayPaymentId,
    });
};

module.exports = {
    checkout,
    paymentVerification,
};
