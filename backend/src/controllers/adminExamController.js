// backend/src/controllers/adminExamController.js
const prisma = require('../config/prismaClient');

// 获取所有试卷 (给管理员看，可能包含未发布等信息)
const getAllExams = async (req, res) => {
    try {
        const exams = await prisma.exam.findMany({
            include: { subject: true },
            orderBy: { title: 'asc' },
        });
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ error: '获取试卷列表失败' });
    }
};

// 获取单个试卷的详细信息
const getExamById = async (req, res) => {
    try {
        const { id } = req.params;
        const exam = await prisma.exam.findUnique({ where: { id } });
        if (!exam) return res.status(404).json({ error: '试卷未找到' });
        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ error: '获取试卷详情失败' });
    }
};

// 创建一个新试卷 (这个和我们之前做的类似)
const createExam = async (req, res) => {
    try {
        const { title, durationMinutes, subjectId } = req.body;
        const newExam = await prisma.exam.create({
            data: {
                title,
                durationMinutes: parseInt(durationMinutes),
                subjectId: parseInt(subjectId),
            },
        });
        res.status(201).json(newExam);
    } catch (error) {
        res.status(500).json({ error: '创建试卷失败' });
    }
};

// 更新一个已存在的试卷
const updateExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, durationMinutes, subjectId } = req.body;
        const updatedExam = await prisma.exam.update({
            where: { id },
            data: {
                title,
                durationMinutes: parseInt(durationMinutes),
                subjectId: parseInt(subjectId),
            },
        });
        res.status(200).json(updatedExam);
    } catch (error) {
        res.status(500).json({ error: '更新试卷失败' });
    }
};

// 删除一个试卷
const deleteExam = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.exam.delete({ where: { id } });
        res.status(204).send(); // 204 No Content 表示成功删除
    } catch (error) {
        // 需要注意：如果试卷下还有题目，直接删除会失败，Prisma会报错
        // 真实项目中需要先删除所有关联的题目
        res.status(500).json({ error: '删除试卷失败' });
    }
};

module.exports = {
    getAllExams,
    getExamById,
    createExam,
    updateExam,
    deleteExam,
};