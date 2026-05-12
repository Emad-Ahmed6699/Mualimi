const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '.')));

// API Routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/grades', require('./routes/gradeRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/student-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'student', 'dashboard.html'));
});

app.get('/teacher-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'teacher', 'dashboard.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Mualimi API is running...' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API running on http://localhost:${PORT}/api`);
});
