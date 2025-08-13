// backend/src/controllers/authController.js
const prisma = require('../config/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 1. 导入 jwt 库

const registerUser = async (req, res) => {
    // ... (此函数保持不变)
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: '邮箱、密码和姓名均不能为空' });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: '该邮箱已被注册' });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = await prisma.user.create({
            data: { email, name, passwordHash },
            select: { id: true, email: true, name: true, createdAt: true }
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("注册失败:", error);
        res.status(500).json({ error: '注册过程中发生内部错误' });
    }
};

// --- 新增登录函数 开始 ---
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. 基础验证
        if (!email || !password) {
            return res.status(400).json({ error: '邮箱和密码不能为空' });
        }

        // 2. 查找用户
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(401).json({ error: '无效的邮箱或密码' }); // 401 Unauthorized
        }

        // 3. 验证密码
        // 使用 bcrypt.compare 对比用户输入的密码和数据库中存储的哈希密码
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ error: '无效的邮箱或密码' });
        }

        // 4. 密码匹配成功，生成 JWT Token
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        // 使用一个密钥(secret)来签发 token
        // !! 重要：在真实项目中，这个密钥必须存放在 .env 文件中，绝不能硬编码 !!
        const token = jwt.sign(payload, 'YOUR_JWT_SECRET', { expiresIn: '1d' }); // token 有效期为 1 天

        res.status(200).json({
            message: '登录成功',
            token: token,
            user: { id: user.id, name: user.name, email: user.email },
        });

    } catch (error) {
        console.error("登录失败:", error);
        res.status(500).json({ error: '登录过程中发生内部错误' });
    }
};
// --- 新增登录函数 结束 ---


module.exports = {
    registerUser,
    loginUser, // <-- 导出新函数
};