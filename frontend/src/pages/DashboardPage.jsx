import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar.jsx';
import StatsCard from '../components/dashboard/StatsCard.jsx';
import ProgressChart from '../components/dashboard/ProgressChart.jsx';
import SessionHistoryTable from '../components/dashboard/SessionHistoryTable.jsx';
import Loader from '../components/common/Loader.jsx';
import useAuth from '../hooks/useAuth.js';
import { getSessionHistoryApi } from '../api/interviewApi.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getSessionHistoryApi();
        setSessions(data.sessions || []);
      } catch (err) {
        toast.error('Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const averageScore =
    completedSessions.length > 0
      ? (
          completedSessions.reduce((sum, s) => sum + (s.averageScore || 0), 0) /
          completedSessions.length
        ).toFixed(1)
      : 'N/A';

  const bestScore =
    completedSessions.length > 0
      ? Math.max(...completedSessions.map((s) => s.averageScore || 0)).toFixed(1)
      : 'N/A';

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name} 👋</h1>
            <p>Experience Level: <strong>{user?.experienceLevel || 'Not set'}</strong></p>
          </div>
          <Link to="/interview/setup" className="btn btn-primary">
            + New Interview
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading your dashboard..." />
        ) : (
          <>
            <div className="stats-row">
              <StatsCard label="Total Sessions" value={sessions.length} icon="📋" />
              <StatsCard label="Completed" value={completedSessions.length} icon="✅" />
              <StatsCard label="Avg Score" value={averageScore !== 'N/A' ? `${averageScore}/10` : 'N/A'} icon="📊" />
              <StatsCard label="Best Score" value={bestScore !== 'N/A' ? `${bestScore}/10` : 'N/A'} icon="🏆" />
            </div>

            <div className="chart-section">
              <h2>Score Trend</h2>
              <ProgressChart sessions={completedSessions} />
            </div>

            <div className="history-section">
              <h2>Session History</h2>
              <SessionHistoryTable sessions={sessions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
