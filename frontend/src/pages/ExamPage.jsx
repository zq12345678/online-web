// frontend/src/pages/ExamPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExamById, submitExamAnswers } from '../services/api.js';
import QuestionNavigator from '../components/QuestionNavigator.jsx';
import './ExamPage.css';

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
    const [markedQuestions, setMarkedQuestions] = useState({});

    useEffect(() => {
        const getExamData = async () => {
            try {
                const response = await fetchExamById(examId);
                setExam(response.data);
            } catch (err) {
                setError('加载试卷失败');
            } finally {
                setLoading(false);
            }
        };
        getExamData();
    }, [examId]);

    const handleAnswerChange = (questionId, optionId) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    // --- 恢复被意外删除的 handleSubmit 函数 ---
    const handleSubmit = async () => {
        if (!exam || !exam.questions) return;

        // 检查是否有未完成的题目
        if (Object.keys(userAnswers).length !== exam.questions.length) {
            // 使用 confirm 弹窗让用户二次确认
            if (!confirm("你还有题目未完成，确定要交卷吗？")) {
                return; // 如果用户取消，则不执行任何操作
            }
        }

        try {
            // 调用 API 提交答案
            const response = await submitExamAnswers(examId, userAnswers);
            const submissionResult = response.data;

            // 跳转到结果页面，并携带答卷数据
            navigate(`/results/${submissionResult.id}`, { state: { submission: submissionResult } });

        } catch (err) {
            console.error("交卷失败:", err);
            alert("交卷失败，请稍后再试。");
        }
    };
    // --- 恢复结束 ---

    const goToNext = () => {
        if (exam && currentQuestionIndex < exam.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const goToPrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSelectQuestion = (index) => {
        setCurrentQuestionIndex(index);
        setIsNavigatorOpen(false);
    };

    const toggleMarkForReview = (questionId) => {
        setMarkedQuestions(prevMarked => {
            const newMarked = { ...prevMarked };
            if (newMarked[questionId]) {
                delete newMarked[questionId];
            } else {
                newMarked[questionId] = true;
            }
            return newMarked;
        });
    };

    if (loading) return <div className="centered-message">正在准备考场...</div>;
    if (error) return <div className="centered-message" style={{ color: 'red' }}>{error}</div>;
    if (!exam || !exam.questions || exam.questions.length === 0) return <div className="centered-message">试卷为空或加载失败。</div>;

    const currentQuestion = exam.questions[currentQuestionIndex];
    const isCurrentQuestionMarked = !!markedQuestions[currentQuestion.id];

    const renderQuestionContent = (question) => (
        <div key={question.id}>
            <div className="question-toolbar">
                <div className="question-number-badge">{question.order}</div>
                <label className="mark-for-review">
                    <input
                        type="checkbox"
                        checked={isCurrentQuestionMarked}
                        onChange={() => toggleMarkForReview(question.id)}
                    />
                    Mark for Review
                </label>
            </div>
            <div className="question-text" dangerouslySetInnerHTML={{ __html: question.questionText }} />
            {question.questionType === 'MULTIPLE_CHOICE' && (
                <ul className="options-list">
                    {question.multipleChoiceOptions.map(option => {
                        const isSelected = userAnswers[question.id] === option.id;
                        return (
                            <li
                                key={option.id}
                                className={`option-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleAnswerChange(question.id, option.id)}
                            >
                                <input type="radio" name={`question-${question.id}`} value={option.id} checked={isSelected} readOnly />
                                <label dangerouslySetInnerHTML={{ __html: option.text }} />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );

    return (
        <div className="exam-page-container">
            <header className="exam-header">
                <div>Section 1, Part A</div>
                <div className="header-tools">
                    <button className="tool-button">Highlights & Notes</button>
                    <button className="tool-button">Reference</button>
                    <button className="tool-button">More</button>
                </div>
            </header>

            <main className="exam-main">
                {currentQuestion.layoutType === 'SPLIT' ? (
                    <div className="layout-split-container">
                        <div className="exam-pane stimulus-pane">
                            <div dangerouslySetInnerHTML={{ __html: currentQuestion.stimulusText }} />
                        </div>
                        <div className="exam-pane question-pane">
                            {renderQuestionContent(currentQuestion)}
                        </div>
                    </div>
                ) : (
                    <div className="layout-stacked-container">
                        {currentQuestion.stimulusText && (
                            <div className="stimulus-block" dangerouslySetInnerHTML={{ __html: currentQuestion.stimulusText }} />
                        )}
                        {renderQuestionContent(currentQuestion)}
                    </div>
                )}
            </main>

            <footer className="exam-footer">
                <button className="question-navigator-button" onClick={() => setIsNavigatorOpen(true)}>
                    Question {currentQuestion.order} of {exam.questions.length} ▲
                </button>
                <div className="footer-nav">
                    <button onClick={goToPrev} className="nav-button" disabled={currentQuestionIndex === 0}>Back</button>
                    {currentQuestionIndex === exam.questions.length - 1 ? (
                        <button onClick={handleSubmit} className="nav-button next">Submit</button>
                    ) : (
                        <button onClick={goToNext} className="nav-button next">Next</button>
                    )}
                </div>
            </footer>

            {isNavigatorOpen && (
                <QuestionNavigator
                    questions={exam.questions}
                    currentIndex={currentQuestionIndex}
                    markedQuestions={markedQuestions}
                    userAnswers={userAnswers}
                    onSelect={handleSelectQuestion}
                    onClose={() => setIsNavigatorOpen(false)}
                />
            )}
        </div>
    );
};

export default ExamPage;