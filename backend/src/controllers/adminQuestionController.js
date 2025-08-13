// backend/src/controllers/adminQuestionController.js
const prisma = require('../config/prismaClient');

// 获取某份试卷下的所有题目
const getQuestionsForExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const questions = await prisma.question.findMany({
            where: { examId },
            orderBy: { order: 'asc' },
        });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: '获取题目列表失败' });
    }
};

// 为某份试卷创建一道新题目
const createQuestion = async (req, res) => {
    try {
        const { examId } = req.params;
        const { questionText, stimulusText, questionType, layoutType, order, options } = req.body;

        const newQuestion = await prisma.question.create({
            data: {
                examId,
                questionText,
                stimulusText,
                questionType,
                layoutType,
                order: parseInt(order),
                multipleChoiceOptions: questionType === 'MULTIPLE_CHOICE' && options ? {
                    create: options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect })),
                } : undefined,
            },
            include: { multipleChoiceOptions: true },
        });
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '创建题目失败' });
    }
};

// 更新一道题目
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { questionText, stimulusText, questionType, layoutType, order, options } = req.body;

        // 对于选择题，更新操作比较复杂：需要删除旧选项，创建新选项
        // Prisma 的事务功能可以确保这一系列操作要么全部成功，要么全部失败
        const transactionActions = [];

        // 1. 更新题目本身的基本信息
        transactionActions.push(prisma.question.update({
            where: { id },
            data: { questionText, stimulusText, questionType, layoutType, order: parseInt(order) },
        }));

        // 2. 如果是选择题，处理选项的更新
        if (questionType === 'MULTIPLE_CHOICE' && options) {
            // a. 删除这道题的所有旧选项
            transactionActions.push(prisma.multipleChoiceOption.deleteMany({
                where: { questionId: id },
            }));
            // b. 创建新选项
            transactionActions.push(prisma.question.update({
                where: { id },
                data: {
                    multipleChoiceOptions: {
                        create: options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect })),
                    },
                },
            }));
        }

        await prisma.$transaction(transactionActions);

        const updatedQuestion = await prisma.question.findUnique({
            where: {id},
            include: {multipleChoiceOptions: true}
        });

        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '更新题目失败' });
    }
};

// 删除一道题目
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        // 删除题目时，与之关联的选项也会被级联删除
        await prisma.question.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: '删除题目失败' });
    }
};

module.exports = {
    getQuestionsForExam,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};