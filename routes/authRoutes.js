const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');
const Student = require('../models/student');

// @desc    Register a new teacher
// @route   POST /api/auth/teacher/signup
router.post('/teacher/signup', async (req, res) => {
    try {
        const { name, email, subject, password } = req.body;

        const teacherExists = await Teacher.findOne({ email });
        if (teacherExists) {
            return res.status(400).json({ success: false, error: 'المعلم مسجل مسبقاً' });
        }

        const teacher = await Teacher.create({
            name,
            email,
            subject,
            password
        });

        res.status(201).json({
            success: true,
            data: {
                _id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                role: 'teacher'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Login teacher
// @route   POST /api/auth/teacher/login
router.post('/teacher/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const teacher = await Teacher.findOne({ email }).select('+password');
        if (!teacher || !(await teacher.matchPassword(password))) {
            return res.status(401).json({ success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                role: 'teacher'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Register a new student
// @route   POST /api/auth/student/signup
router.post('/student/signup', async (req, res) => {
    try {
        const { name, studentId, email, age, grade, password } = req.body;

        const studentExists = await Student.findOne({ $or: [{ email }, { studentId }] });
        if (studentExists) {
            return res.status(400).json({ success: false, error: 'الطالب مسجل مسبقاً (البريد أو الكود مستخدم)' });
        }

        const student = await Student.create({
            name,
            studentId,
            email,
            age,
            grade,
            password
        });

        // Auto-assign to Group A (مجموعة أ) as default
        const Group = require('../models/group');
        const defaultGroup = await Group.findOne({ name: 'أ' });
        
        if (defaultGroup) {
            student.group = defaultGroup._id;
            await student.save();
            
            // Add student to group's students list
            if (!defaultGroup.students.includes(student._id)) {
                defaultGroup.students.push(student._id);
                await defaultGroup.save();
            }
        }

        res.status(201).json({
            success: true,
            data: {
                _id: student._id,
                name: student.name,
                studentId: student.studentId,
                group: defaultGroup ? {
                    _id: defaultGroup._id,
                    name: defaultGroup.name
                } : null,
                role: 'student'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Login student
// @route   POST /api/auth/student/login
router.post('/student/login', async (req, res) => {
    try {
        const { studentId, password } = req.body;

        const student = await Student.findOne({ studentId }).select('+password').populate('group');
        if (!student || !(await student.matchPassword(password))) {
            return res.status(401).json({ success: false, error: 'كود الطالب أو كلمة المرور غير صحيحة' });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: student._id,
                name: student.name,
                studentId: student.studentId,
                group: student.group ? {
                    _id: student.group._id,
                    name: student.group.name
                } : null,
                role: 'student'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
