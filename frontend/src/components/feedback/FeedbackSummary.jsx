import React from 'react';

export default function FeedbackSummary({ session, averageScore }) {
  return (
    <div className="feedback-summary">
      <h2>Interview Summary</h2>
      <p>
        <strong>Role:</strong> {session.role} &nbsp;|&nbsp; <strong>Experience:</strong>{' '}
        {session.experienceLevel} &nbsp;|&nbsp; <strong>Topic:</strong> {session.topic}
      </p>
      <h1 className="average-score">{averageScore?.toFixed(1) ?? 'N/A'} / 10</h1>
      <p>Average score across all questions in this session.</p>
    </div>
  );
}
