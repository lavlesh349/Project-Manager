const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const projectsRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json()); // Parse JSON requests

app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));

mongoose.connect('mongodb://localhost:27017');


app.use('/api/projects', projectsRoutes);
app.use('/api/auth', authRoutes);

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB successfully');
});
