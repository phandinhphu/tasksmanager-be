const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
    task_name: { type: String, required: true },
    task_description: { type: String, required: true },
    userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: Schema.Types.ObjectId, ref: 'Status', required: true },
    priority: { type: Schema.Types.ObjectId, ref: 'Priority', required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    completed_date: { type: Date },
    extend_date: { type: Date },
    subtasks: [{
        task_name: { type: String, required: true },
        task_description: { type: String, required: true },
        completed: { type: Boolean, default: false },
        completed_date: { type: Date },
        status: { type: Schema.Types.ObjectId, ref: 'Status', required: true },
        priority: { type: Schema.Types.ObjectId, ref: 'Priority', required: true },
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        extend_date: { type: Date },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);