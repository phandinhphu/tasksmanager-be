const chatRoomSchema = require("../models/ChatRoom");
const chatMessageSchema = require("../models/ChatMessage");
const userSchema = require("../models/User");

class ChatController {
    // [GET] /me/rooms
    async getMyChatRooms(req, res) {
        try {
            const userId = req.user._id;
            const chatRooms = await chatRoomSchema
                .find({ members: userId })
                .populate("members", "name email avatar");

            res.status(200).json(chatRooms);
        } catch (error) {
            console.error("Error fetching chat rooms:", error);
            res.status(500).json({
                message: "Error fetching chat rooms",
                error,
            });
        }
    }

    // [POST] /rooms
    async createChatRoom(req, res) {
        try {
            const { name, email } = req.body;
            const userId = req.user._id;
            let members = [];
            let isGroup = false;

            // Ensure the creator is included in the members list
            members.push(userId);

            const userInvite = await userSchema.findOne({ email });
            if (userInvite) {
                members.push(userInvite._id);
            }

            isGroup = members.length > 2;

            const newChatRoom = new chatRoomSchema({
                name,
                isGroup,
                members,
            });

            await newChatRoom.save();
            res.status(201).json(newChatRoom);
        } catch (error) {
            console.error("Error creating chat room:", error);
            res.status(500).json({
                message: "Error creating chat room",
                error,
            });
        }
    }

    // [GET] /rooms/:roomId
    async getChatRoom(req, res) {
        try {
            const { roomId } = req.params;
            const chatRoom = await chatRoomSchema.findById(roomId);

            const messagesRoom = await chatMessageSchema
                .find({ chatRoom: roomId })
                .populate("sender", "name email avatar")
                .populate("chatRoom", "name isGroup members");

            if (!chatRoom) {
                return res.status(404).json({
                    message: "Chat room not found",
                });
            }
            res.status(200).json({
                messages: messagesRoom,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error fetching chat room",
                error,
            });
        }
    }

    // [POST] /rooms/:roomId/messages
    async sendMessage(req, res) {
        try {
            const { roomId } = req.params;
            const { content } = req.body;
            const userId = req.user._id;

            const chatRoom = await chatRoomSchema.findById(roomId);
            if (!chatRoom) {
                return res.status(404).json({
                    message: "Chat room not found",
                });
            }

            const newMessage = new chatMessageSchema({
                content,
                sender: userId,
                chatRoom: roomId,
            });

            await newMessage.save();

            res.status(201).json(newMessage);
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).json({
                message: "Error sending message",
                error,
            });
        }
    }
}

module.exports = new ChatController();
