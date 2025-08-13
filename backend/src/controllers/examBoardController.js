// backend/src/controllers/examBoardController.js
const prisma = require('../config/prismaClient');

// 1. 创建一个新的考试局
const createExamBoard = async (req, res) => {
    try {
        // 从请求体中获取 'name'
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: '考试局名称 (name) 不能为空' });
        }

        const newExamBoard = await prisma.examBoard.create({
            data: {
                name: name,
            },
        });

        res.status(201).json(newExamBoard); // 201 表示“已创建”
    } catch (error) {
        res.status(500).json({ error: '创建考试局时发生错误' });
    }
};

// 2. 获取所有考试局
const getAllExamBoards = async (req, res) => {
    try {
        const examBoards = await prisma.examBoard.findMany();
        res.status(200).json(examBoards);
    } catch (error) {
        res.status(500).json({ error: '获取考试局列表时发生错误' });
    }
};

module.exports = {
    createExamBoard,
    getAllExamBoards,
};