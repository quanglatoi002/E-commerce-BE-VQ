const authRouter = require("./authRoute");
const productRouter = require("./productRoute");
const blogRouter = require("./blogRoute");
const couponRouter = require("./couponRoute");
const categoryRouter = require("./prodCategoryRoute");
const blogCategoryRouter = require("./blogCategoryRoute");
const brandRouter = require("./brandRoute");
const colorRouter = require("./colorRoute");
const enquiryRouter = require("./enqRoute");
const updateRouter = require("./uploadRoute");
const notifiRouter = require("./notifiRoute");
const bucketRouter = require("./bucketRoute");
const { pushToLogDiscord } = require("../middlewares/loggers");

const initRoutes = (app) => {
    // app.use(pushToLogDiscord);
    app.use("/api/upload", updateRouter);
    app.use("/api/user", authRouter);
    app.use("/api/product", productRouter);
    app.use("/api/blog", blogRouter);
    app.use("/api/category", categoryRouter);
    app.use("/api/blogCategory", blogCategoryRouter);
    app.use("/api/brand", brandRouter);
    app.use("/api/coupon", couponRouter);
    app.use("/api/color", colorRouter);
    app.use("/api/enquiry", enquiryRouter);
    app.use("/api/send-notification", notifiRouter);
    app.use("/api/bucket", bucketRouter);
};

module.exports = initRoutes;
