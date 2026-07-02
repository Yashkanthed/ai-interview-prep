import React from 'react';

export default function AnswerInput({ value, onChange, disabled }) {
  return (
    <textarea
      className="answer-textarea"
      rows={8}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer here..."
      disabled={disabled}
    />
  );
}
