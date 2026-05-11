const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');

// @desc    Get all attendance records
router.get('/', async (req, res) => {
    try {
        const records = await Attendance.find().populate('student').populate('group');
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get attendance for a student
router.get('/student/:studentId', async (req, res) => {
    try {
        const records = await Attendance.find({ student: req.params.studentId }).populate('group');
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get attendance for a group on a date
router.get('/group/:groupId', async (req, res) => {
    try {
        const records = await Attendance.find({ group: req.params.groupId }).populate('student');
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Mark attendance
router.post('/', async (req, res) => {
    try {
        const attendance = await Attendance.create(req.body);
        res.status(201).json({ success: true, data: attendance });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Update attendance
router.put('/:id', async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!attendance) {
            return res.status(404).json({ success: false, error: 'Attendance record not found' });
        }
        res.status(200).json({ success: true, data: attendance });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Delete attendance
router.delete('/:id', async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndDelete(req.params.id);
        if (!attendance) {
            return res.status(404).json({ success: false, error: 'Attendance record not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
