export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const scoreToLabel = (score) => {
  if (score >= 8) return { label: 'Excellent', color: '#16a34a' };
  if (score >= 6) return { label: 'Good', color: '#2563eb' };
  if (score >= 4) return { label: 'Average', color: '#d97706' };
  return { label: 'Needs Improvement', color: '#dc2626' };
};
