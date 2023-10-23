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

module.exports = {
    incr,
    expire,
    ttl,
};
