import React from 'react';
import toast from 'react-hot-toast';
import { updateUserRoleApi, deleteUserApi } from '../../api/adminApi.js';

export default function AdminUserTable({ users, onChange }) {
  const handleRoleToggle = async (userItem) => {
    const newRole = userItem.role === 'admin' ? 'user' : 'admin';
    try {
      await updateUserRoleApi(userItem._id, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      onChange();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update role');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await deleteUserApi(userId);
      toast.success('User deleted');
      onChange();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete user');
    }
  };

  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Experience</th>
          <th>Role</th>
          <th>Joined</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.experienceLevel || '-'}</td>
            <td>{u.role}</td>
            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            <td>
              <button className="btn btn-secondary" onClick={() => handleRoleToggle(u)}>
                Make {u.role === 'admin' ? 'User' : 'Admin'}
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(u._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
