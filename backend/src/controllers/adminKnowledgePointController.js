/**
 * adminKnowledgePointController.js
 * 负责处理知识点（KnowledgePoint）的增删改查（CRUD）操作。
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 创建一个新的知识点
 */
const createKnowledgePoint = async (req, res) => {
    console.log("✅ 请求已成功到达 createKnowledgePoint 函数！");
    console.log("收到的请求体 (Request Body):", req.body);

    try {
        const { name, subjectId } = req.body;
        if (!name || !subjectId) {
            return res.status(400).json({ error: "请求参数不完整，需要提供 name 和 subjectId。" });
        }

        const newKnowledgePoint = await prisma.knowledgePoint.create({
            data: {
                name: name,
                subject: { connect: { id: subjectId } },
            },
        });
        res.status(201).json(newKnowledgePoint);

    } catch (error) {
        console.error("❌ 在 createKnowledgePoint 函数中发生错误:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: `关联失败，ID 为 ${req.body.subjectId} 的 Subject 不存在。` });
        }
        res.status(500).json({ error: "创建知识点时发生服务器内部错误。" });
    }
};

/**
 * 根据 ID 删除一个知识点 (新增的函数)
 */
const deleteKnowledgePoint = async (req, res) => {
    console.log(`✅ 请求已到达 deleteKnowledgePoint 函数，准备删除 ID: ${req.params.id}`);

    try {
        const knowledgePointId = parseInt(req.params.id, 10);
        if (isNaN(knowledgePointId)) {
            return res.status(400).json({ error: '无效的ID格式。' });
        }

        await prisma.knowledgePoint.delete({
            where: { id: knowledgePointId },
        });

        res.status(204).send();

    } catch (error) {
        console.error("❌ 在 deleteKnowledgePoint 函数中发生错误:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: `ID 为 ${req.params.id} 的知识点不存在，无法删除。` });
        }
        res.status(500).json({ error: "删除知识点时发生服务器内部错误。" });
    }
};

// 确保两个函数都被导出
module.exports = {
    createKnowledgePoint,
    deleteKnowledgePoint,
};