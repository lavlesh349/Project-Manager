// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['completed', 'high priority', 'on going', 'cancel'],
        default: 'on going',
    },
});

module.exports = mongoose.model('Task', taskSchema);
