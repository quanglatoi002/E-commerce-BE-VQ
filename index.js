const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
const clientRedis = require("./config/connections_redis");
const redis = require("redis");
const subscriber = redis.createClient();
const app = express();
const dotenv = require("dotenv").config();
const os = require("os");

app.use(cors());

const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const couponRouter = require("./routes/couponRoute");
const categoryRouter = require("./routes/prodCategoryRoute");
const blogCategoryRouter = require("./routes/blogCategoryRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enquiryRouter = require("./routes/enqRoute");
const updateRouter = require("./routes/uploadRoute");
const notifiRouter = require("./routes/notifiRoute");

const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const httpServer = require("http").createServer(app);
// cors with socket
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Đặt đúng địa chỉ của frontend React
        methods: ["GET", "POST"],
    },
});
process.env.UV_THREADPOOL_SIZE = os.cpus().length;

dbConnect();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

subscriber.subscribe("notifications");
// Xử lý khi nhận được thông điệp từ kênh đã đăng ký
subscriber.on("message", function (channel, message) {
    io.emit("notifications", JSON.parse(message));
});

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogCategory", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/upload", updateRouter);
app.use("/api/send-notification", notifiRouter);
app.use(notFound);
app.use(errorHandler);
httpServer.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
