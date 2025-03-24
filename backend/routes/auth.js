// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config(); // Load environment variables

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login a user
// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set');
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Include both user id and username in the token payload
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, token }); // Return the token in the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
