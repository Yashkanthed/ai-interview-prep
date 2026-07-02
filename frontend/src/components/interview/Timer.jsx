import React from 'react';
import { formatTime } from '../../utils/formatters.js';

export default function Timer({ secondsLeft }) {
  const isLow = secondsLeft <= 15;
  return <div className={`timer ${isLow ? 'timer-low' : ''}`}>⏱ {formatTime(secondsLeft)}</div>;
}
