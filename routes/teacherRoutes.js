const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');

// @desc    Get all teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('groups');
        res.status(200).json({ success: true, count: teachers.length, data: teachers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get single teacher
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate('groups');
        if (!teacher) {
            return res.status(404).json({ success: false, error: 'Teacher not found' });
        }
        res.status(200).json({ success: true, data: teacher });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Create new teacher
router.post('/', async (req, res) => {
    try {
        const teacher = await Teacher.create(req.body);
        res.status(201).json({ success: true, data: teacher });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Update teacher
router.put('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!teacher) {
            return res.status(404).json({ success: false, error: 'Teacher not found' });
        }
        res.status(200).json({ success: true, data: teacher });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Delete teacher
router.delete('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) {
            return res.status(404).json({ success: false, error: 'Teacher not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
