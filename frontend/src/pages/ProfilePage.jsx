import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar.jsx';
import Input from '../components/common/Input.jsx';
import Select from '../components/common/Select.jsx';
import Button from '../components/common/Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { updateProfileApi } from '../api/authApi.js';
import { EXPERIENCE_LEVELS } from '../utils/constants.js';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    experienceLevel: user?.experienceLevel || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      const { data } = await updateProfileApi(form);
      setUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="auth-form">
          <h2>Your Profile</h2>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-role-badge">{user?.role}</p>
          <form onSubmit={handleSubmit}>
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Select
              label="Experience Level"
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
              options={EXPERIENCE_LEVELS}
              placeholder="Select experience level"
            />
            <Button type="submit" loading={loading} fullWidth>Save Changes</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
