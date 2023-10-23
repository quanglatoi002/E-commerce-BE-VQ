const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4,
        });
        if (conn.connection.readyState === 1)
            console.log("Mongodb connection is successfully!");
        else console.log("DB connection is failed");
    } catch (error) {
        console.log("DB connection is failed");
        throw new Error(error);
    }
};

module.exports = dbConnect;
