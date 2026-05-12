const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');
const QuizSubmission = require('../models/quizSubmission');
const Grade = require('../models/grade');

// Special routes BEFORE generic :id routes
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

// @desc    Get quizzes for student's group
router.get('/student/:groupId', async (req, res) => {
    try {
        const now = new Date();
        const quizzes = await Quiz.find({
            group: req.params.groupId,
            isActive: true
        })
            .populate('teacher')
            .populate('group')
            .select('title description group startDate endDate isActive -accessCode');
        
        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Generic routes
// @desc    Get all quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('teacher').populate('group');
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
        const { studentId, answers, cheatingData } = req.body;
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

        // Create submission with cheating data if present
        const submissionData = {
            quiz: req.params.id,
            student: studentId,
            answers,
            score,
            totalPoints: quiz.totalPoints
        };

        // If cheating was detected
        if (cheatingData && cheatingData.cheatingFlags) {
            submissionData.cheatingFlags = true;
            submissionData.cheatingDetails = cheatingData.cheatingDetails;
            submissionData.tabSwitchAttempts = cheatingData.tabSwitchAttempts || 0;
            submissionData.windowBlurAttempts = cheatingData.windowBlurAttempts || 0;
            submissionData.warnings = cheatingData.warnings || [];
            submissionData.isEarlySubmit = true;
            submissionData.earlySubmitReason = 'اكتشاف غش - محاولة مغادرة الامتحان';
        }

        const submission = await QuizSubmission.create(submissionData);

        // Create grade record
        const gradeData = {
            student: studentId,
            quiz: req.params.id,
            group: quiz.group,
            score: score,
            totalPoints: quiz.totalPoints,
            percentage: (score / quiz.totalPoints) * 100
        };

        // If cheating, add warning flag
        if (cheatingData && cheatingData.cheatingFlags) {
            gradeData.cheatingFlag = true;
        }

        await Grade.create(gradeData);

        // Add submission to quiz
        await Quiz.findByIdAndUpdate(
            req.params.id,
            { $push: { submissions: submission._id } }
        );

        res.status(201).json({ 
            success: true, 
            data: submission,
            isCheating: cheatingData && cheatingData.cheatingFlags ? true : false
        });
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

// @desc    Get quizzes for student's group
router.get('/student/:groupId', async (req, res) => {
    try {
        const now = new Date();
        const quizzes = await Quiz.find({
            group: req.params.groupId,
            isActive: true
        })
            .populate('teacher')
            .populate('group')
            .select('title description group startDate endDate isActive -accessCode');
        
        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Verify quiz access code
router.post('/:id/verify-access', async (req, res) => {
    try {
        const { accessCode } = req.body;
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ success: false, error: 'Quiz not found' });
        }

        if (quiz.accessCode !== accessCode) {
            return res.status(401).json({ success: false, error: 'رمز الدخول غير صحيح' });
        }

        // Check if quiz is still active
        const now = new Date();
        if (now < quiz.startDate || now > quiz.endDate) {
            return res.status(403).json({ success: false, error: 'الامتحان غير متاح في الوقت الحالي' });
        }

        // Return quiz details without access code
        res.status(200).json({ 
            success: true, 
            message: 'تم التحقق بنجاح',
            data: {
                id: quiz._id,
                title: quiz.title,
                description: quiz.description,
                questions: quiz.questions,
                totalPoints: quiz.totalPoints,
                startDate: quiz.startDate,
                endDate: quiz.endDate
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
