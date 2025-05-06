const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set")
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log("Error connecting to MongoDB:", error)
        process.exit(1)
    }
}

module.exports = connectDB