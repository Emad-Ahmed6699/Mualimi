const express = require('express');
const router = express.Router();
const Group = require('../models/group');

// @desc    Get all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().populate('teacher').populate('students');
        res.status(200).json({ success: true, count: groups.length, data: groups });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get single group
router.get('/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('teacher').populate('students');
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }
        res.status(200).json({ success: true, data: group });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Create group
router.post('/', async (req, res) => {
    try {
        const group = await Group.create(req.body);
        res.status(201).json({ success: true, data: group });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Update group
router.put('/:id', async (req, res) => {
    try {
        const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }
        res.status(200).json({ success: true, data: group });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Add student to group
router.post('/:id/add-student', async (req, res) => {
    try {
        const { studentId } = req.body;
        const group = await Group.findByIdAndUpdate(
            req.params.id,
            { $push: { students: studentId } },
            { new: true }
        ).populate('students');
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }
        res.status(200).json({ success: true, data: group });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Delete group
router.delete('/:id', async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
