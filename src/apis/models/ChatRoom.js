const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatRoomSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        isGroup: { type: Boolean, default: false },
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
