const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: 'https://res.cloudinary.com/dqj0xgk8h/image/upload/v1698231234/avatars/default-avatar.png' },
    avatar_id: { type: String, default: 'default-avatar' },
    verified: { type: Boolean, default: false },
    verifyToken: { type: String, default: null },
    forgotPasswordToken: { type: String, default: null },
    googleId: { type: String, default: null },
    facebookId: { type: String, default: null },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);