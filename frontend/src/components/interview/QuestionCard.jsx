import React from 'react';

export default function QuestionCard({ question, index, total }) {
  return (
    <div className="question-card">
      <span className="question-counter">
        Question {index + 1} of {total}
      </span>
      <h3>{question?.text}</h3>
      {question?.difficulty && <span className={`badge badge-${question.difficulty}`}>{question.difficulty}</span>}
    </div>
  );
}
