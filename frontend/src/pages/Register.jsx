import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileCheck2, User, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password, confirmPassword);
      navigate('/analyze');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <h2>Create Free Account</h2>
          <p className="auth-subtext">Join thousands of professionals optimizing resumes for ATS filters.</p>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-modern">
          <div className="form-field-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <User size={17} className="field-icon" />
              <input
                type="text"
                id="name"
                placeholder="e.g. Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
                autoComplete="name"
                required
              />
            </div>
          </div>

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

          <div className="form-field-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={17} className="field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="btn-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-field-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <Lock size={17} className="field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="auth-perks-box">
            <div className="perk-item">
              <CheckCircle2 size={14} className="text-success" />
              <span>Free instant ATS analysis & scoring</span>
            </div>
            <div className="perk-item">
              <CheckCircle2 size={14} className="text-success" />
              <span>Exportable PDF executive reports</span>
            </div>
          </div>

          <button type="submit" className="btn-primary btn-auth-submit" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-switch-link">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
