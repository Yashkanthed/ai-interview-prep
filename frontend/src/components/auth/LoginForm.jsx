import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import useAuth from '../../hooks/useAuth.js';
import { validateLoginForm } from '../../utils/validators.js';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Link to="/forgot-password" className="forgot-link">
        Forgot password?
      </Link>
      <Button type="submit" loading={loading} fullWidth>
        Login
      </Button>
      <p>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
