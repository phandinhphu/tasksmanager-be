const mongoose = require('mongoose');
const { Schema } = mongoose;

const prioritySchema = new Schema({
    name: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Priority', prioritySchema);