// backend/src/routes/examBoardRoutes.js
const express = require('express');
const router = express.Router();
const { createExamBoard, getAllExamBoards } = require('../controllers/examBoardController');

// 当有 POST 请求发送到 / 时，调用 createExamBoard 函数
router.post('/', createExamBoard);

// 当有 GET 请求发送到 / 时，调用 getAllExamBoards 函数
router.get('/', getAllExamBoards);

module.exports = router;