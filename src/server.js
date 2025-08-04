const http = require("http");
const app = require("./index");
const socketManager = require("./sockets/socketManager");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { PORT } = require("./util/constants");

// cron job
// require("./services/job");

const server = http.createServer(app);
socketManager.init(server); // Khởi tạo socket
const io = socketManager.getIO(); // Lấy instance của Socket.IO

const _PORT = PORT || 3000;

connectDB().then(() => {
    server.listen(_PORT, () => {
        console.log(`Server running on port ${_PORT}`);
    });
});

// Xử lý tắt server và đóng kết nối
const gracefulShutdown = async () => {
    console.log("\n⏳ Gracefully shutting down...");
    try {
        await mongoose.connection.close();
        console.log("✅ MongoDB connection closed");

        io.close(() => {
            console.log("🔌 Socket.IO server closed");
        });

        server.close(() => {
            console.log("🛑 HTTP server closed");
            process.exit(0);
        });
    } catch (err) {
        console.error("❌ Error during shutdown:", err);
        process.exit(1);
    }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
