const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatMessageSchema = new Schema(
    {
        content: { type: String, required: true },
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        chatRoom: {
            type: Schema.Types.ObjectId,
            ref: "ChatRoom",
            required: true,
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
