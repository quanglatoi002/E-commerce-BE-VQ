const clientRedis = require("../config/connections_redis");

// đếm số lần user req
const incr = (key) => {
    return new Promise((resolve, reject) => {
        clientRedis.incr(key, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// time mà user req
const expire = (key, ttl) => {
    return new Promise((resolve, reject) => {
        clientRedis.expire(key, ttl, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// time còn lại sau kần đầu req
const ttl = (key) => {
    return new Promise((resolve, reject) => {
        clientRedis.ttl(key, (err, ttl) => {
            if (err) return reject(err);
            resolve(ttl);
        });
    });
};

const requestLimitMiddleware = async (req, res, next) => {
    try {
        //get ip user
        const getIpUser =
            req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        // số lượng req
        const numRequest = await incr(getIpUser);
        let _ttl;
        // sau lần đầu req mới cấp time
        if (numRequest === 1) {
            await expire(getIpUser, 60);
            _ttl = 60;
        } else {
            _ttl = await ttl(getIpUser);
        }
        // nếu quá số lần req...
        if (numRequest > 20) {
            return res.status(503).json({
                status: "error",
                _ttl,
                message: "Server is busy",
                numRequest,
            });
        }
        next();
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    requestLimitMiddleware,
};
