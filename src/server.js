const http = require("http");
const app = require("./index");
const dotenv = require('dotenv')
const socketManager = require("./sockets/socketManager");
const connectDB = require('./config/db')

// cron job
require("./services/scheduler");

dotenv.config();

const server = http.createServer(app);
socketManager.init(server); // Khởi tạo socket

const PORT = process.env.PORT || 3002;

connectDB().then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
})
