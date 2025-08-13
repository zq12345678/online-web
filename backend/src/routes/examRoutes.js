// backend/src/routes/examRoutes.js
const express = require('express');
const router = express.Router();
// --- 修改这里，导入新函数 ---
const { createExam, getAllExams, getExamById } = require('../controllers/examController');
const questionRoutes = require('./questionRoutes');

// POST /api/exams - 创建一个新试卷
router.post('/', createExam);

// GET /api/exams - 获取所有试卷
router.get('/', getAllExams);

// --- 新增代码 开始 ---
// GET /api/exams/:examId - 获取单个试卷的详细信息
router.get('/:examId', getExamById);
// --- 新增代码 结束 ---

// 将 /:examId/questions 的请求转发给 questionRoutes
router.use('/:examId/questions', questionRoutes);

module.exports = router;