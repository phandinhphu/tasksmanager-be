const { Server } = require("socket.io");

let io;
const userSockets = new Map();

function init(server) {
    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        socket.on("register", (userId) => {
            userSockets.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        });

        socket.on("disconnect", () => {
            for (let [userId, id] of userSockets) {
                if (id === socket.id) {
                    userSockets.delete(userId);
                    console.log(`User ${userId} disconnected`);
                }
            }
        });
    });
}

function sendNotification(userId, payload) {
    const socketId = userSockets.get(userId);
    if (socketId) {
        io.to(socketId).emit("notification", payload);
    }
}

module.exports = { init, sendNotification };
