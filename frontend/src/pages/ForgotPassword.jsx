import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../apis/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // Step 1: Request PIN, Step 2: Submit Reset
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRequestPin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setMessage(res.message);
        setStep(2);
      } else {
        setError(res.message || 'Failed to request reset pin.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await resetPassword(email, token, newPassword, confirmPassword);
      if (res.success) {
        setMessage(res.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(res.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="hero-section">
        <h1>Reset Password</h1>
        <p>Recover your account password using a secure verification code.</p>
      </div>

      <div className="upload-card">
        {step === 1 ? (
          <form onSubmit={handleRequestPin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Sending PIN...' : 'Send Reset PIN'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="token">6-Digit Reset PIN</label>
              <input
                type="text"
                id="token"
                placeholder="Enter 6-digit verification code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message" style={{ color: 'var(--success-color)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', textAlign: 'center' }}>{message}</div>}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="auth-link">
          Remember your password? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
