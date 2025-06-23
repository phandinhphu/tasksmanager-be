const http = require("http");
const app = require("./index");
const dotenv = require("dotenv");
const socketManager = require("./sockets/socketManager");
const connectDB = require("./config/db");
const { default: mongoose } = require("mongoose");

// cron job
require("./services/jobManager");

dotenv.config();

const server = http.createServer(app);
const io = socketManager.getIO();
socketManager.init(server); // Khởi tạo socket

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Process close server and disconnect

const gracefulShutdown = async () => {
  console.log("\n⏳ Gracefully shutting down...");
  try {
    await mongoose.connection.close();
    console.log("✔ MongoDB connection closed");

    io.close(() => {
      console.log("🔌 Socket.IO server closed");
    });

    server.close(() => {
      console.log("🔌 HTTP server closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
