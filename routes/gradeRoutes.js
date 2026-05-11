const express = require('express');
const router = express.Router();
const Grade = require('../models/grade');

// @desc    Get all grades
router.get('/', async (req, res) => {
    try {
        const grades = await Grade.find().populate('student').populate('quiz').populate('group');
        res.status(200).json({ success: true, count: grades.length, data: grades });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get grades for a student
router.get('/student/:studentId', async (req, res) => {
    try {
        const grades = await Grade.find({ student: req.params.studentId }).populate('quiz').populate('group');
        res.status(200).json({ success: true, count: grades.length, data: grades });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get grades for a group
router.get('/group/:groupId', async (req, res) => {
    try {
        const grades = await Grade.find({ group: req.params.groupId }).populate('student').populate('quiz');
        res.status(200).json({ success: true, count: grades.length, data: grades });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Create grade
router.post('/', async (req, res) => {
    try {
        const { score, totalPoints } = req.body;
        const percentage = (score / totalPoints) * 100;
        
        const grade = await Grade.create({
            ...req.body,
            percentage
        });
        res.status(201).json({ success: true, data: grade });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Update grade
router.put('/:id', async (req, res) => {
    try {
        let updateData = req.body;
        if (updateData.score && updateData.totalPoints) {
            updateData.percentage = (updateData.score / updateData.totalPoints) * 100;
        }
        
        const grade = await Grade.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });
        if (!grade) {
            return res.status(404).json({ success: false, error: 'Grade not found' });
        }
        res.status(200).json({ success: true, data: grade });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Delete grade
router.delete('/:id', async (req, res) => {
    try {
        const grade = await Grade.findByIdAndDelete(req.params.id);
        if (!grade) {
            return res.status(404).json({ success: false, error: 'Grade not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
