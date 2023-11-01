const mongoose = require("mongoose");
require("dotenv").config();
class DatabaseConnection {
    constructor() {
        if (!DatabaseConnection.instance) {
            this._connect();
            DatabaseConnection.instance = this;
        }
        return DatabaseConnection.instance;
    }

    _connect() {
        mongoose
            .connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                family: 4,
            })
            .then(() => {
                console.log("Mongodb connection is successfully!");
            })
            .catch((error) => {
                console.error("DB connection failed: ", error);
            });
    }
}

const instance = new DatabaseConnection();
//đảm bảo rằng instance của lớp không thể được thay đổi sau khi được tạo ra.
Object.freeze(instance);

module.exports = instance;
