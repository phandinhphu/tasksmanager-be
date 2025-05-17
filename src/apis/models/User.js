const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: 'https://res.cloudinary.com/dqj0xgk8h/image/upload/v1698231234/avatars/default-avatar.png' },
    avatar_id: { type: String, default: 'default-avatar' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);