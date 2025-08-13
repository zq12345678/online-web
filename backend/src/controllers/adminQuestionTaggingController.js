/**
 * adminQuestionTaggingController.js
 * 负责处理问题（Question）和知识点（Tag）之间的关联关系。
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addTagToQuestion = async (req, res) => {
    try {
        const { questionId, newPointId } = req.body;
        if (!questionId || !newPointId) {
            return res.status(400).json({ error: "请求参数不完整。" });
        }

        // --- 新增的检查逻辑 ---
        // 在添加前，先查询问题是否已关联该知识点
        const existingQuestion = await prisma.question.findFirst({
            where: {
                id: questionId,
                knowledgePoints: { some: { id: newPointId } }
            }
        });

        // 如果已经存在关联，则返回 409 Conflict 错误
        if (existingQuestion) {
            return res.status(409).json({ error: "该标签已关联到此问题，请勿重复添加。" });
        }
        // --- 检查逻辑结束 ---

        const updatedQuestion = await prisma.question.update({
            where: { id: questionId },
            data: { knowledgePoints: { connect: { id: newPointId } } },
            include: { knowledgePoints: true },
        });
        res.status(200).json(updatedQuestion);

    } catch (error) {
        if (error.code === 'P2025' || error.code === 'P2016') {
            return res.status(404).json({ error: "操作失败，指定的问题或知识点不存在。" });
        }
        console.error('添加标签关联失败:', error);
        res.status(500).json({ error: '服务器内部错误。' });
    }
};

const removeTagFromQuestion = async (req, res) => {
    try {
        const { questionId, pointIdToRemove } = req.body;
        if (!questionId || !pointIdToRemove) {
            return res.status(400).json({ error: "请求参数不完整。" });
        }
        await prisma.question.update({
            where: { id: questionId },
            data: { knowledgePoints: { disconnect: { id: pointIdToRemove } } },
        });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025' || error.code === 'P2016') {
            return res.status(404).json({ error: "操作失败，指定的问题或知识点不存在。" });
        }
        console.error('移除标签关联失败:', error);
        res.status(500).json({ error: '服务器内部错误。' });
    }
};

module.exports = {
    addTagToQuestion,
    removeTagFromQuestion,
};