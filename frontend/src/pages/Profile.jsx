import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../apis/api';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Calendar,
  BarChart,
  LogOut,
  UploadCloud,
  History,
  ShieldCheck,
  Award,
} from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.success) {
          setProfile(res.data);
        } else {
          setError(res.message || 'Failed to load profile.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred loading your profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="profile-loading-overlay">
        <div className="spinner"></div>
        <h2>Loading profile details...</h2>
      </div>
    );
  }

  return (
    <div className="profile-page-root">
      <div className="profile-header-card">
        <div className="profile-hero-info">
          <div className="profile-avatar-large">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1>{profile?.name || 'Candidate Account'}</h1>
            <p className="profile-email-badge">
              <Mail size={14} /> {profile?.email}
            </p>
          </div>
        </div>

        <div className="profile-hero-actions">
          <button className="btn-primary" onClick={() => navigate('/analyze')}>
            <UploadCloud size={16} />
            <span>Analyze Resume</span>
          </button>
          <button className="btn-secondary" onClick={() => navigate('/history')}>
            <History size={16} />
            <span>History</span>
          </button>
        </div>
      </div>

      {error && <div className="profile-error-alert">{error}</div>}

      <div className="profile-details-grid">
        {/* Account Information Card */}
        <div className="profile-info-card">
          <div className="card-top">
            <User size={18} className="text-indigo" />
            <h3>Account Details</h3>
          </div>

          <div className="profile-items-list">
            <div className="profile-item">
              <span className="item-label">Full Name</span>
              <p className="item-val">{profile?.name || '—'}</p>
            </div>

            <div className="profile-item">
              <span className="item-label">Email Address</span>
              <p className="item-val">{profile?.email || '—'}</p>
            </div>

            <div className="profile-item">
              <span className="item-label">Member Since</span>
              <p className="item-val">
                {profile?.createdAt ? formatDate(profile.createdAt) : 'Recent'}
              </p>
            </div>

            <div className="profile-item">
              <span className="item-label">Account Security</span>
              <p className="item-val text-success">
                <ShieldCheck size={14} /> Verified & Active
              </p>
            </div>
          </div>
        </div>

        {/* Usage & Grading Stats Card */}
        <div className="profile-info-card">
          <div className="card-top">
            <BarChart size={18} className="text-indigo" />
            <h3>Resume Grading Statistics</h3>
          </div>

          <div className="profile-items-list">
            <div className="profile-item">
              <span className="item-label">Total Resumes Graded</span>
              <p className="item-val highlight">{profile?.totalAnalyses || 0}</p>
            </div>

            <div className="profile-item">
              <span className="item-label">ATS Plan Tier</span>
              <p className="item-val">
                <span className="plan-badge">Pro Candidate Tier</span>
              </p>
            </div>

            <div className="profile-item">
              <span className="item-label">AI Engine</span>
              <p className="item-val">meta-llama/Llama-3.3-70B-Instruct</p>
            </div>

            <div className="profile-item">
              <span className="item-label">Report Export Format</span>
              <p className="item-val">High-Resolution Multi-Page PDF</p>
            </div>
          </div>

          <div className="profile-logout-wrap">
            <button className="btn-profile-logout" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
