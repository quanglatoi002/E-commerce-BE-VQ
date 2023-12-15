const Nonce = require("../models/nonceModel");

const securityNonce = async (req, res, next) => {
    // đã nhận nonce
    const receivedNonce = req.headers["x-nonce"];
    // đã nhận time
    const receivedTimestamp = parseInt(req.headers["x-timestamp"]);
    // chuyển từ mili giây thành giây
    const currentTime = Math.floor(Date.now() / 1000);
    const allowedTime = 300;
    if (!receivedNonce || isNaN(receivedTimestamp)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // kiểm tra xem nonce đã được sử dụng trước đó ch
    const existingNonce = await Nonce.findOne({ none: receivedNonce });
    // 190000 - 189700 > 200
    // time hiện tại - time nhận được mà > time cho phép nó hoạt động thì err
    if (
        existingNonce ||
        Math.abs(currentTime - receivedTimestamp) > allowedTime
    ) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // Lưu nonce vào cơ sở dữ liệu để xác minh sử dụng sau này
    await Nonce.create({ nonce: receivedNonce, timestamp: receivedTimestamp });

    next(); // Tiếp tục xử lý yêu cầu
};

module.exports = securityNonce;
