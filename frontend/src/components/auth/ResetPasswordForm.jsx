import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { resetPasswordApi } from '../../api/authApi.js';
import { isStrongPassword } from '../../utils/validators.js';

export default function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(form.password)) {
      toast.error('Password must be 8+ characters with letters and numbers');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await resetPasswordApi(token, { password: form.password });
      toast.success('Password reset successful. Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed or link expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Reset Password</h2>
      <Input label="New Password" name="password" type="password" value={form.password} onChange={handleChange} />
      <Input
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
      />
      <Button type="submit" loading={loading} fullWidth>
        Reset Password
      </Button>
    </form>
  );
}
