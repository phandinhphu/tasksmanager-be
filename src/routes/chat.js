const express = require("express");
const route = express.Router();
const ChatController = require("../apis/controllers/ChatController");

const verifyToken = require("../middleware/auth");

route.use(verifyToken);

route.get("/me/rooms", ChatController.getMyChatRooms);
route.post("/rooms", ChatController.createChatRoom);
route.get("/rooms/:roomId", ChatController.getChatRoom);
route.post("/rooms/:roomId/messages", ChatController.sendMessage);

module.exports = route;
