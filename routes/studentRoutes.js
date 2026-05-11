const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// @desc    Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Create new student
router.post('/', async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json({ success: true, data: student });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Verify student for quiz
router.post('/verify', async (req, res) => {
    try {
        const { name, studentId } = req.body;
        const student = await Student.findOne({ name, studentId });
        if (!student) {
            return res.status(404).json({ success: false, error: 'الطالب غير موجود أو البيانات غير صحيحة' });
        }
        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
