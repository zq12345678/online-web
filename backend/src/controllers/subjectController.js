// backend/src/controllers/subjectController.js
const prisma = require('../config/prismaClient');

// 1. 创建一个新学科，并关联到已有的考试局
const createSubject = async (req, res) => {
    try {
        // 从请求体中获取学科名称和它所属的考试局ID
        const { name, examBoardId } = req.body;

        // 基础验证
        if (!name || !examBoardId) {
            return res.status(400).json({ error: '学科名称 (name) 和考试局ID (examBoardId) 不能为空' });
        }

        const newSubject = await prisma.subject.create({
            data: {
                name: name,
                examBoardId: parseInt(examBoardId), // 确保ID是整数类型
            },
        });

        res.status(201).json(newSubject);
    } catch (error) {
        console.error(error); // 在控制台打印错误，方便调试
        res.status(500).json({ error: '创建学科时发生错误' });
    }
};

// 2. 获取所有学科，并包含其所属的考试局信息
const getAllSubjects = async (req, res) => {
    try {
        const subjects = await prisma.subject.findMany({
            // 使用 "include" 来同时加载关联的 examBoard 数据
            include: {
                examBoard: true,
            },
        });
        res.status(200).json(subjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '获取学科列表时发生错误' });
    }
};

module.exports = {
    createSubject,
    getAllSubjects,
};