const { createClient } = require("redis");

const client = createClient({
    host: "127.0.0.1",
    port: 6379,
});

client.ping((err, pong) => {
    console.log(pong);
});

client.on("ready", () => {
    console.log("Redis to ready");
});

// Kiểm tra kết nối Redis
client.on("connect", () => {
    console.log("Connected to Redis");
});

client.on("error", (error) => {
    console.error(error);
});

module.exports = client;
