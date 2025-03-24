const express = require('express');
const asyncHandler = require('express-async-handler');
const Project = require('../models/Project'); // Adjust path as necessary
const auth = require('../middleware/auth'); // Import the authentication middleware
const router = express.Router();

// Fetch all projects for a specific user
router.get('/', auth, asyncHandler(async (req, res) => {
    const userId = req.userId;
    const userName = req.userName;

    console.log(userId, "*");
    const projects = await Project.find({
        $or: [
            { creator: userId },
            { 'teamMembers.username': userName }
        ]
    });

    // Check if the user is the creator for any of the found projects
    const projectsWithRole = projects.map(project => ({
        ...project.toObject(),
        isCreator: project.creator.toString() === userId // Add a flag to identify the creator
    }));

    if (!projectsWithRole.length) {
        return res.status(404).json({ message: 'No projects found for this user.' });
    }

    res.status(200).json(projectsWithRole);
}));

// Fetch project details by ID
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json(project);
}));

// Add a new project
router.post('/add', auth, asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate } = req.body;
    const userId = req.userId;
    console.log(userId);

    // Validate input fields
    if (!title || !description || !startDate || !endDate) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const newProject = new Project({
        title,
        description,
        startDate,
        endDate,
        tasks: [],
        teamMembers: [],
        creator: userId
    });
    console.log("project id:",userId);

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully.', project: newProject });
}));

// Add a new task to a project
router.post('/:id/tasks', auth, asyncHandler(async (req, res) => {
    console.log("*")
    const { id } = req.params
    // console.log(req.body);
    const task = req.body;
    const { label, priority, status }=task;
    console.log(label, priority, status)

    // Validate input fields
    if (!label || !priority || !status) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const project = await Project.findById(id);
    if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
    }

    const newTask = { label, priority, status };
    project.tasks.push(newTask);
    await project.save();

    res.status(201).json({ message: 'Task added successfully.', task: newTask });
}));

// Remove a task from a project
router.delete('/:id/tasks/:taskId', auth, asyncHandler(async (req, res) => {
    const { id, taskId } = req.params;

    const project = await Project.findById(id);
    if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
    }

    const taskExists = project.tasks.some(task => task._id.toString() === taskId);
    if (!taskExists) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    project.tasks = project.tasks.filter(task => task._id.toString() !== taskId);
    await project.save();

    res.status(204).send();
}));

// Add a new team member to a project
router.post('/:id/members', auth, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;
    // console.log(username);
    // Validate input fields
    if (!username) {
        return res.status(400).json({ message: 'Username is required.' });
    }

    const project = await Project.findById(id);
    if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
    }

    const memberExists = project.teamMembers.some(member => member.username === username);
    if (memberExists) {
        return res.status(400).json({ message: 'Member already exists.' });
    }

    const newMember = { username };
    project.teamMembers.push(newMember);
    await project.save();

    res.status(201).json({ message: 'Member added successfully.', member: newMember });
}));

// Remove a team member from a project
router.delete('/:id/members/:memberId', auth, asyncHandler(async (req, res) => {
    const { id, memberId } = req.params;

    const project = await Project.findById(id);
    if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
    }

    const memberExists = project.teamMembers.some(member => member._id.toString() === memberId);
    if (!memberExists) {
        return res.status(404).json({ message: 'Member not found.' });
    }

    project.teamMembers = project.teamMembers.filter(member => member._id.toString() !== memberId);
    await project.save();

    res.status(204).send();
}));

module.exports = router;
