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
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);

const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001"], // Cho phép yêu cầu từ domain này
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức được phép
    credentials: true,
    // Cho phép truy cập các thông tin đăng nhập từ client
};

app.use(cors(corsOptions));

const io = socketIo(server, {
    cors: corsOptions,
});
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Thêm xử lý sự kiện Socket.io nếu cần thiết
});
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

process.env.UV_THREADPOOL_SIZE = os.cpus().length;

dbConnect;
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

subscriber.subscribe("newOrder");
subscriber.subscribe("notifications");
// Xử lý khi nhận được thông điệp từ kênh đã đăng ký
subscriber.on("message", function (channel, message) {
    console.log(message);
    if (channel === "notifications") {
        io.emit("notifications", JSON.parse(message));
    }
    if (channel === "newOrder") {
        // Gửi thông báo đến tất cả các clients
        io.emit("newOrder", JSON.parse(message));
    }
});
//router
initRoutes(app);

app.use(notFound);
app.use(errorHandler);
server.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
