const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    answers: [{
        questionIndex: Number,
        selectedAnswer: String
    }],
    score: {
        type: Number,
        default: 0
    },
    totalPoints: Number,
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);
