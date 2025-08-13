// backend/src/controllers/questionController.js
const prisma = require('../config/prismaClient');

const createQuestionForExam = async (req, res) => {
    try {
        const { examId } = req.params;
        // --- 核心修正：从请求体中接收新增的 stimulusText 和 layoutType 字段 ---
        const { questionText, questionType, order, options, stimulusText, layoutType } = req.body;

        if (!questionText || !questionType || !order) {
            return res.status(400).json({ error: '题干、类型和顺序不能为空' });
        }

        const newQuestion = await prisma.question.create({
            data: {
                questionText,
                questionType,
                order: parseInt(order),
                examId: examId,
                // --- 核心修正：将新字段添加到创建数据中 ---
                stimulusText: stimulusText, // 可以为 null 或字符串
                layoutType: layoutType,     // 会使用 schema 中定义的默认值 "STACKED"

                multipleChoiceOptions: {
                    create: questionType === 'MULTIPLE_CHOICE' && options ? options.map(opt => ({
                        text: opt.text,
                        isCorrect: opt.isCorrect,
                    })) : [],
                },
            },
            include: {
                multipleChoiceOptions: true,
            }
        });

        res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '创建题目时发生错误' });
    }
};

module.exports = {
    createQuestionForExam,
};