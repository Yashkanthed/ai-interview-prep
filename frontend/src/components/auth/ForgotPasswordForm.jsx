import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { forgotPasswordApi, verifyResetOtpApi, resetPasswordApi } from '../../api/authApi.js';
import { isValidEmail, isStrongPassword } from '../../utils/validators.js';

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');   // 'email' | 'otp' | 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { toast.error('Enter a valid email'); return; }
    setLoading(true);
    try {
      await forgotPasswordApi({ email });
      setStep('otp');
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input helpers ─────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) document.getElementById(`rotp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`rotp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      document.getElementById('rotp-5')?.focus();
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Enter the complete 6-digit OTP'); return; }
    setLoading(true);
    try {
      const { data } = await verifyResetOtpApi({ email, otp: otpString });
      setResetToken(data.resetToken);
      setStep('reset');
      toast.success('OTP verified!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Set new password ──────────────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(passwords.password)) {
      toast.error('Password must be 8+ chars with letters and numbers');
      return;
    }
    if (passwords.password !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await resetPasswordApi({ email, resetToken, password: passwords.password });
      toast.success('Password reset! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Email step ────────────────────────────────────────────────────────────
  if (step === 'email') {
    return (
      <form onSubmit={handleSendOtp} className="auth-form">
        <h2>Forgot Password</h2>
        <p>Enter your email and we will send you a 6-digit OTP.</p>
        <Input label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" loading={loading} fullWidth>Send OTP</Button>
        <p><Link to="/login">Back to Login</Link></p>
      </form>
    );
  }

  // ── OTP step ──────────────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <form onSubmit={handleVerifyOtp} className="auth-form">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
          <h2>Enter OTP</h2>
          <p style={{ color: '#6b7280' }}>
            Sent to <strong>{email}</strong>
          </p>
        </div>

        <div className="otp-boxes" onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`rotp-${i}`}
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

        <Button type="submit" loading={loading} fullWidth>Verify OTP</Button>
      </form>
    );
  }

  // ── Reset password step ───────────────────────────────────────────────────
  return (
    <form onSubmit={handleReset} className="auth-form">
      <h2>Set New Password</h2>
      <Input
        label="New Password"
        name="password"
        type="password"
        value={passwords.password}
        onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
      />
      <Input
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        value={passwords.confirmPassword}
        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
      />
      <Button type="submit" loading={loading} fullWidth>Reset Password</Button>
    </form>
  );
}