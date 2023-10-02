const Razarpay = require("razorpay");

const instance = new Razarpay({
    key_id: "rzp_test_OR9hf09RIN79Vg",
    key_secret: "0R440tVI3HdsZZMiDAaGqPXP",
});

const checkout = async (req, res) => {
    const option = {
        amount: 50000,
        currency: "INR",
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
