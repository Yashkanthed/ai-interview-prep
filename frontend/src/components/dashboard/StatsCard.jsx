import React from 'react';

export default function StatsCard({ label, value, icon }) {
  return (
    <div className="stats-card">
      {icon && <span className="stats-icon">{icon}</span>}
      <div>
        <div className="stats-value">{value}</div>
        <div className="stats-label">{label}</div>
      </div>
    </div>
  );
}
