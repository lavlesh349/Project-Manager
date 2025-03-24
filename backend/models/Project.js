const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    tasks: [{ label: String, priority: String, status: String }],
    teamMembers: [{ username: String }], // Assuming username is stored here
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Link to user
});

const Projects = mongoose.model('Projects', projectSchema);
module.exports = Projects;
