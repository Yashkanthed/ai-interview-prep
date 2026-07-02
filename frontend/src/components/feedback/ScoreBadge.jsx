import React from 'react';
import { scoreToLabel } from '../../utils/formatters.js';

export default function ScoreBadge({ score }) {
  const { label, color } = scoreToLabel(score);
  return (
    <div className="score-badge" style={{ borderColor: color }}>
      <span className="score-number" style={{ color }}>
        {score}/10
      </span>
      <span className="score-label">{label}</span>
    </div>
  );
}
