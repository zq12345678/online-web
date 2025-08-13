// backend/src/routes/subjectRoutes.js
const express = require('express');
const router = express.Router();
const { createSubject, getAllSubjects } = require('../controllers/subjectController');

// POST /api/subjects - 创建一个新学科
router.post('/', createSubject);

// GET /api/subjects - 获取所有学科
router.get('/', getAllSubjects);

module.exports = router;