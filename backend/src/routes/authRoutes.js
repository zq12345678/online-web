// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
// --- 1. 导入 loginUser ---
const { registerUser, loginUser } = require('../controllers/authController');

// POST /api/auth/register - 用户注册
router.post('/register', registerUser);

// --- 2. 添加登录路由 ---
// POST /api/auth/login - 用户登录
router.post('/login', loginUser);

module.exports = router;