const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
const clientRedis = require("./config/connections_redis");
const redis = require("redis");
const subscriber = redis.createClient();
const app = express();
const dotenv = require("dotenv").config();
const os = require("os");
const compression = require("compression");
const PORT = process.env.PORT || 4000;
const initRoutes = require("./routes");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

app.use(cors());
// chỉ compression những file trên 100kb
app.use(
    compression({
        // tiêu chuẩn lv6 để ko tăng sức chịu tải của server
        level: 6,
        threshold: 100 * 1000,
        filter: (req, res) => {
            if (req.headers["x-no-compress"]) {
                return false;
            }
            return compression.filter(req, res);
        },
    })
);

const httpServer = require("http").createServer(app);
// cors with socket
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Đặt đúng địa chỉ của frontend React
        methods: ["GET", "POST"],
    },
});
process.env.UV_THREADPOOL_SIZE = os.cpus().length;

dbConnect;
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

subscriber.subscribe("notifications");
// Xử lý khi nhận được thông điệp từ kênh đã đăng ký
subscriber.on("message", function (channel, message) {
    io.emit("notifications", JSON.parse(message));
});
//router
initRoutes(app);

app.use(notFound);
app.use(errorHandler);
httpServer.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
