const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: null }, // Thêm trường avatar
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);