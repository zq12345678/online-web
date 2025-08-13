// backend/src/routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const { submitExam } = require('../controllers/submissionController.js');

// POST /api/submissions
router.post('/', submitExam);

module.exports = router;