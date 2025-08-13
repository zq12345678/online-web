// frontend/src/components/QuestionNavigator.jsx
import React from 'react';
import './QuestionNavigator.css';

const QuestionNavigator = ({ questions, currentIndex, markedQuestions, userAnswers, onSelect, onClose }) => {
    return (
        <div className="navigator-overlay" onClick={onClose}>
            <div className="navigator-modal" onClick={(e) => e.stopPropagation()}>
                <h4>Section 1, Part A Questions</h4>

                <div className="legend">
                    <div><span className="legend-icon current"></span> Current</div>
                    <div><span className="legend-icon unanswered"></span> Unanswered</div>
                    <div><span className="legend-icon for-review">🚩</span> For Review</div>
                </div>

                <div className="navigator-grid">
                    {questions.map((question, index) => {
                        const isMarked = !!markedQuestions[question.id];
                        const isAnswered = !!userAnswers[question.id];
                        const isCurrent = index === currentIndex;

                        let buttonClass = 'grid-item';
                        if (isCurrent) buttonClass += ' current';
                        if (!isAnswered) buttonClass += ' unanswered';

                        return (
                            <button
                                key={question.id}
                                className={buttonClass}
                                onClick={() => onSelect(index)}
                            >
                                {question.order}
                                {isMarked && <span className="review-flag">🚩</span>}
                            </button>
                        );
                    })}
                </div>
                {/* 我们已经移除了 "Go to Review Page" 按钮 */}
            </div>
        </div>
    );
};

export default QuestionNavigator;