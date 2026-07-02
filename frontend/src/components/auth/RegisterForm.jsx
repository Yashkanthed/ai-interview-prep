import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import { registerApi, verifyOtpApi, resendOtpApi } from '../../api/authApi.js';
import { validateRegisterForm } from '../../utils/validators.js';
import { EXPERIENCE_LEVELS } from '../../utils/constants.js';
import useAuth from '../../hooks/useAuth.js';

export default function RegisterForm() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('register'); // 'register' | 'otp'
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', experienceLevel: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Step 1: Register ──────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await registerApi(payload);
      setRegisteredEmail(form.email);
      setStep('otp');
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: OTP boxes ────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // digits only
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    // Auto-focus next box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      document.getElementById('otp-5')?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const { data } = await verifyOtpApi({ email: registeredEmail, otp: otpString });
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
      toast.success('Email verified! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtpApi({ email: registeredEmail });
      toast.success('New OTP sent!');
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend OTP');
    } finally {
      setResending(false);
    }
  };

  // ── OTP Step UI ───────────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <form onSubmit={handleVerifyOtp} className="auth-form">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📧</div>
          <h2>Verify Your Email</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            We sent a 6-digit OTP to<br />
            <strong>{registeredEmail}</strong>
          </p>
        </div>

        <div className="otp-boxes" onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className="otp-box"
              autoFocus={i === 0}
            />
          ))}
        </div>

        <Button type="submit" loading={loading} fullWidth>
          Verify OTP
        </Button>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
          Did not receive it?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="link-btn"
          >
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </p>
      </form>
    );
  }

  // ── Register Step UI ──────────────────────────────────────────────────────
  return (
    <form onSubmit={handleRegister} className="auth-form">
      <h2>Create Account</h2>
      <Input label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
      <Select
        label="Current Experience Level"
        name="experienceLevel"
        value={form.experienceLevel}
        onChange={handleChange}
        options={EXPERIENCE_LEVELS}
        placeholder="Select experience level"
      />
      <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
      <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
      <Button type="submit" loading={loading} fullWidth>Register</Button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}