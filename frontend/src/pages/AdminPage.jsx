import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar.jsx';
import AdminUserTable from '../components/dashboard/AdminUserTable.jsx';
import SessionHistoryTable from '../components/dashboard/SessionHistoryTable.jsx';
import Loader from '../components/common/Loader.jsx';
import { getAllUsersApi, getAllSessionsApi } from '../api/adminApi.js';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, sRes] = await Promise.all([getAllUsersApi(), getAllSessionsApi()]);
      setUsers(uRes.data.users || []);
      setSessions(sRes.data.sessions || []);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1>Admin Panel</h1>
        <div className="admin-tabs">
          <button
            className={`btn ${tab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('users')}
          >
            Users ({users.length})
          </button>
          <button
            className={`btn ${tab === 'sessions' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('sessions')}
          >
            All Sessions ({sessions.length})
          </button>
        </div>

        {loading ? (
          <Loader message="Loading admin data..." />
        ) : tab === 'users' ? (
          <AdminUserTable users={users} onChange={loadData} />
        ) : (
          <SessionHistoryTable sessions={sessions} />
        )}
      </div>
    </div>
  );
}
