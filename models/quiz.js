const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a quiz title']
    },
    description: String,
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    questions: [{
        question: String,
        options: [String],
        correctAnswer: String,
        points: Number
    }],
    totalPoints: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        default: 30,
        description: 'Quiz duration in minutes'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    accessCode: {
        type: String,
        required: true,
        unique: true
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizSubmission'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema);
