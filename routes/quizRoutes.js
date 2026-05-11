const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');
const QuizSubmission = require('../models/quizSubmission');

// @desc    Get all quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('teacher').populate('group');
        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get active quizzes
router.get('/active/list', async (req, res) => {
    try {
        const now = new Date();
        const quizzes = await Quiz.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).populate('teacher').populate('group');
        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get single quiz
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('teacher').populate('group');
        if (!quiz) {
            return res.status(404).json({ success: false, error: 'Quiz not found' });
        }
        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Create quiz
router.post('/', async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Update quiz
router.put('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!quiz) {
            return res.status(404).json({ success: false, error: 'Quiz not found' });
        }
        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Submit quiz answer
router.post('/:id/submit', async (req, res) => {
    try {
        const { studentId, answers } = req.body;
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ success: false, error: 'Quiz not found' });
        }

        let score = 0;
        answers.forEach((answer, index) => {
            if (quiz.questions[index] && quiz.questions[index].correctAnswer === answer.selectedAnswer) {
                score += quiz.questions[index].points || 0;
            }
        });

        const submission = await QuizSubmission.create({
            quiz: req.params.id,
            student: studentId,
            answers,
            score,
            totalPoints: quiz.totalPoints
        });

        // Add submission to quiz
        await Quiz.findByIdAndUpdate(
            req.params.id,
            { $push: { submissions: submission._id } }
        );

        res.status(201).json({ success: true, data: submission });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Delete quiz
router.delete('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false, error: 'Quiz not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
