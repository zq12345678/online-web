// backend/src/routes/adminExamRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllExams,
    getExamById,
    createExam,
    updateExam,
    deleteExam
} = require('../controllers/adminExamController');
const adminQuestionRoutes = require('./adminQuestionRoutes'); // 1. 导入

router.get('/', getAllExams);
router.post('/', createExam);
router.get('/:id', getExamById);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

// 2. 将所有 /:examId/questions 的请求转发给 adminQuestionRoutes
router.use('/:examId/questions', adminQuestionRoutes);

module.exports = router;