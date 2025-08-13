// backend/src/server.js
const express = require('express');
const cors = require('cors');

// 导入所有路由文件
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const adminExamRoutes = require('./routes/adminExamRoutes');
const adminKnowledgePointRoutes = require('./routes/adminKnowledgePointRoutes');
const adminQuestionTaggingRoutes = require('./routes/adminQuestionTaggingRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 公共 API
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/submissions', submissionRoutes);

// 管理员专用 API
app.use('/api/admin/exams', adminExamRoutes);
app.use('/api/admin/knowledge-points', adminKnowledgePointRoutes);
app.use('/api/admin/question-tags', adminQuestionTaggingRoutes); // 使用简化的顶级路由

app.listen(PORT, () => {
    console.log(`后端服务器正在 http://localhost:${PORT} 上运行`);
});