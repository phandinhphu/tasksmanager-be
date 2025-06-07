const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set")
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        process.exit(1)
    }
}

module.exports = connectDB