import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters.js';

export default function SessionHistoryTable({ sessions }) {
  if (!sessions?.length) {
    return <p>No interview sessions yet. Start your first mock interview!</p>;
  }

  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Role</th>
          <th>Experience</th>
          <th>Topic</th>
          <th>Score</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((s) => (
          <tr key={s._id}>
            <td>{formatDate(s.createdAt)}</td>
            <td>{s.role}</td>
            <td>{s.experienceLevel}</td>
            <td>{s.topic}</td>
            <td>{s.averageScore != null ? `${s.averageScore.toFixed(1)}/10` : '-'}</td>
            <td>
              <span className={`status-badge status-${s.status}`}>{s.status}</span>
            </td>
            <td>
              <Link to={`/feedback/${s._id}`}>View</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
