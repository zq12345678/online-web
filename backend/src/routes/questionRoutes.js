// backend/src/routes/questionRoutes.js
const express = require('express');
// a. 开启 mergeParams 以便获取上层路由的 URL 参数 (如 :examId)
const router = express.Router({ mergeParams: true });
const { createQuestionForExam } = require('../controllers/questionController');

// POST /api/exams/:examId/questions
router.post('/', createQuestionForExam);

module.exports = router;