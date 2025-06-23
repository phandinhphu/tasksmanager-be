const mongoose = require("mongoose");
const { MONGODB_URI } = require("../../util/constants");

async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
    } catch (error) {
        process.exit(1);
    }
}

module.exports = connectDB;
