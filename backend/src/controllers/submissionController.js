// backend/src/controllers/submissionController.js
const prisma = require('../config/prismaClient');

const submitExam = async (req, res) => {
    try {
        // --- 这里是唯一的修改 ---
        // 我们使用刚刚在数据库中手动创建的真实用户ID
        const userId = "test-user-01";
        // --- 修改结束 ---

        const { examId, answers } = req.body;

        if (!examId || !answers) {
            return res.status(400).json({ error: '缺少 examId 或 answers' });
        }

        const examWithQuestions = await prisma.exam.findUnique({
            where: { id: examId },
            include: {
                questions: {
                    include: {
                        multipleChoiceOptions: true,
                    },
                },
            },
        });

        if (!examWithQuestions) {
            return res.status(404).json({ error: '试卷不存在' });
        }

        let score = 0;
        const totalQuestions = examWithQuestions.questions.length;

        for (const question of examWithQuestions.questions) {
            if (question.questionType === 'MULTIPLE_CHOICE') {
                const correctAnswer = question.multipleChoiceOptions.find(opt => opt.isCorrect);
                const userAnswerId = answers[question.id];

                if (correctAnswer && userAnswerId === correctAnswer.id) {
                    score++;
                }
            }
        }

        const finalScore = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

        const newSubmission = await prisma.examSubmission.create({
            data: {
                userId: userId,
                examId: examId,
                score: finalScore,
                userAnswers: {
                    create: Object.entries(answers).map(([questionId, optionId]) => ({
                        questionId: questionId,
                        answerContent: optionId,
                    })),
                },
            },
            include: {
                userAnswers: {
                    include: {
                        question: {
                            include: {
                                multipleChoiceOptions: true
                            }
                        }
                    }
                }
            }
        });

        res.status(201).json(newSubmission);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '提交试卷时发生错误' });
    }
};

module.exports = { submitExam };