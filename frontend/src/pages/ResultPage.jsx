// frontend/src/pages/ResultPage.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './ResultPage.css'; // 我们将为结果页添加一些样式

const ResultPage = () => {
    const location = useLocation();
    const submission = location.state?.submission;

    if (!submission) {
        return (
            <div className="result-container">
                <h1>错误</h1>
                <p>无法加载考试结果，可能是因为你直接访问了此页面。</p>
                <Link to="/">返回主页</Link>
            </div>
        );
    }

    // 帮助函数：根据选项ID，从问题的所有选项中找到该选项的文本
    const getOptionTextById = (question, optionId) => {
        const option = question.multipleChoiceOptions.find(opt => opt.id === optionId);
        return option ? option.text : '未作答';
    };

    // 帮助函数：找到正确答案的文本
    const getCorrectAnswerText = (question) => {
        const correctOption = question.multipleChoiceOptions.find(opt => opt.isCorrect);
        return correctOption ? correctOption.text : '无正确答案';
    };

    return (
        <div className="result-container">
            <div className="summary-card">
                <h1>考试结果</h1>
                <h2>{submission.exam?.title || '试卷回顾'}</h2>
                <p className="score">
                    你的分数: <span>{submission.score.toFixed(2)} / 100</span>
                </p>
                <Link to="/" className="home-link">返回主页</Link>
            </div>

            <div className="details-container">
                <h2>题目详情</h2>
                {submission.userAnswers
                    .sort((a, b) => a.question.order - b.question.order) // 按题号排序
                    .map((answer, index) => {
                        const question = answer.question;
                        const userAnswerText = getOptionTextById(question, answer.answerContent);
                        const correctAnswerText = getCorrectAnswerText(question);
                        const isCorrect = userAnswerText === correctAnswerText;

                        return (
                            <div key={answer.id} className="question-review-card">
                                <h4>第 {question.order} 题</h4>
                                <div className="question-text" dangerouslySetInnerHTML={{ __html: question.questionText }} />

                                <div className={`answer-info ${isCorrect ? 'correct' : 'incorrect'}`}>
                                    <p><strong>你的答案:</strong> {userAnswerText} {isCorrect ? '✔' : '✖'}</p>
                                </div>

                                {!isCorrect && (
                                    <div className="answer-info correct">
                                        <p><strong>正确答案:</strong> {correctAnswerText}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default ResultPage;