const mongoose = require('mongoose');
const { Schema } = mongoose;

const scheduleSchema = new Schema({
    title: { type: String, required: true },
    userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    days: { type: Array, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    repeat: { type: String, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Schedule', scheduleSchema);