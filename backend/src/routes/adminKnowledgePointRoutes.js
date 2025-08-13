/**
 * adminKnowledgePointRoutes.js
 * 定义所有与“知识点”自身增删改查相关的 API 路由。
 */

const express = require('express');
const router = express.Router();

// 从控制器中导入需要用到的所有函数
const { createKnowledgePoint, deleteKnowledgePoint } = require('../controllers/adminKnowledgePointController.js');

// 规则一: 创建知识点 (POST /)
router.post('/', createKnowledgePoint);

// 规则二: 根据 ID 删除知识点 (DELETE /:id)
router.delete('/:id', deleteKnowledgePoint);


module.exports = router;