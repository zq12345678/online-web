/**
 * adminQuestionTaggingRoutes.js
 * 定义所有与“问题-标签”关联关系相关的 API 路由。
 */
const express = require('express');
const router = express.Router();

// 确保从控制器中同时导入了 add 和 remove 两个函数
const { addTagToQuestion, removeTagFromQuestion } = require('../controllers/adminQuestionTaggingController');

// 规则一：处理 POST /add 请求，用于添加标签
router.post('/add', addTagToQuestion);

// 规则二：处理 DELETE /remove 请求，用于移除标签
router.delete('/remove', removeTagFromQuestion);


// 导出路由，以便在主服务文件中使用
module.exports = router;