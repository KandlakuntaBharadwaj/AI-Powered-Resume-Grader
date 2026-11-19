import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../apis/api';
import { FileCheck2, Mail, KeyRound, Lock, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

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
        }, 2500);
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
    <div className="auth-page-root">
      <div className="auth-card-modern">
        <div className="auth-brand-header">
          <div className="logo-icon-bg">
            <FileCheck2 size={24} className="logo-icon" />
          </div>
          <h2>Reset Password</h2>
          <p className="auth-subtext">
            {step === 1
              ? 'Enter your account email to receive a secure 6-digit recovery PIN.'
              : 'Enter the 6-digit recovery code and choose a new password.'}
          </p>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="auth-alert success">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestPin} className="auth-form-modern">
            <div className="form-field-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={17} className="field-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary btn-auth-submit" disabled={submitting}>
              {submitting ? 'Sending PIN...' : 'Send Recovery PIN'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form-modern">
            <div className="form-field-group">
              <label htmlFor="token">6-Digit Verification PIN</label>
              <div className="input-with-icon">
                <KeyRound size={17} className="field-icon" />
                <input
                  type="text"
                  id="token"
                  placeholder="e.g. 123456"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-with-icon">
                <Lock size={17} className="field-icon" />
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-with-icon">
                <Lock size={17} className="field-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary btn-auth-submit" disabled={submitting}>
              {submitting ? 'Resetting Password...' : 'Update Password & Log In'}
            </button>

            <button
              type="button"
              className="btn-link-step-back"
              onClick={() => setStep(1)}
              disabled={submitting}
            >
              Need a new PIN? Go back
            </button>
          </form>
        )}

        <div className="auth-footer-prompt">
          <Link to="/login" className="back-to-login-link">
            <ArrowLeft size={15} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
