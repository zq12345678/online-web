// backend/src/controllers/examController.js
const prisma = require('../config/prismaClient');

const createExam = async (req, res) => {
    // ... (此函数保持不变)
    try {
        const { title, durationMinutes, subjectId } = req.body;

        if (!title || !durationMinutes || !subjectId) {
            return res.status(400).json({ error: '标题(title), 时长(durationMinutes), 和学科ID(subjectId)均不能为空' });
        }

        const newExam = await prisma.exam.create({
            data: {
                title: title,
                durationMinutes: parseInt(durationMinutes),
                subjectId: parseInt(subjectId),
            },
        });

        res.status(201).json(newExam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '创建试卷时发生错误' });
    }
};

const getAllExams = async (req, res) => {
    // ... (此函数保持不变)
    try {
        const exams = await prisma.exam.findMany({
            include: {
                subject: {
                    include: {
                        examBoard: true,
                    },
                },
            },
        });
        res.status(200).json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '获取试卷列表时发生错误' });
    }
};

// --- 新增函数 开始 ---
const getExamById = async (req, res) => {
    try {
        const { examId } = req.params;
        const exam = await prisma.exam.findUnique({
            where: {
                id: examId,
            },
            // 这里是关键：在查找试卷的同时，加载所有关联的问题，
            // 并且对于每个问题，如果它是选择题，再加载它所有的选项
            include: {
                questions: {
                    orderBy: {
                        order: 'asc', // 按题号升序排序
                    },
                    include: {
                        multipleChoiceOptions: true, // 加载选择题选项
                    },
                },
            },
        });

        if (!exam) {
            return res.status(404).json({ error: '找不到指定ID的试卷' });
        }

        res.status(200).json(exam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '获取试卷详情时发生错误' });
    }
};
// --- 新增函数 结束 ---

module.exports = {
    createExam,
    getAllExams,
    getExamById, // <-- 导出新函数
};