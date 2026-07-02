import React from 'react';
import ScoreBadge from './ScoreBadge.jsx';

export default function FeedbackCard({ question, answer, feedback }) {
  if (!feedback) {
    return (
      <div className="feedback-card feedback-pending">
        <h4>{question?.text}</h4>
        <p>Feedback is being generated...</p>
      </div>
    );
  }

  return (
    <div className="feedback-card">
      <h4>{question?.text}</h4>
      <p className="user-answer">
        <strong>Your answer:</strong> {answer?.text}
      </p>
      <ScoreBadge score={feedback.score} />
      <div className="feedback-section">
        <strong>Strengths</strong>
        <ul>
          {feedback.strengths?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="feedback-section">
        <strong>Weaknesses</strong>
        <ul>
          {feedback.weaknesses?.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>
      <div className="feedback-section">
        <strong>Suggestions</strong>
        <ul>
          {feedback.suggestions?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
