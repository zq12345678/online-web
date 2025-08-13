// backend/src/routes/adminQuestionRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const { getQuestionsForExam, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/adminQuestionController');

router.get('/', getQuestionsForExam);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

// 关键：确保这里没有 router.use(...) 的嵌套代码

module.exports = router;