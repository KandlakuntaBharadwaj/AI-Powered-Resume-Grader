import React, { useState, useEffect } from 'react';
import { getProfile } from '../apis/api';
import { User, Mail, Calendar, BarChart } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <h2>Loading your profile details...</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your account settings and view your resume grading statistics.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {profile && (
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <h2>{profile.name}</h2>
            <p className="profile-role">Resume Grader User</p>
          </div>

          <div className="profile-details">
            <div className="profile-detail-item">
              <div className="detail-icon">
                <User size={20} />
              </div>
              <div className="detail-info">
                <label>Full Name</label>
                <p>{profile.name}</p>
              </div>
            </div>

            <div className="profile-detail-item">
              <div className="detail-icon">
                <Mail size={20} />
              </div>
              <div className="detail-info">
                <label>Email Address</label>
                <p>{profile.email}</p>
              </div>
            </div>

            <div className="profile-detail-item">
              <div className="detail-icon">
                <Calendar size={20} />
              </div>
              <div className="detail-info">
                <label>Account Created On</label>
                <p>{formatDate(profile.createdAt)}</p>
              </div>
            </div>

            <div className="profile-detail-item">
              <div className="detail-icon">
                <BarChart size={20} />
              </div>
              <div className="detail-info">
                <label>Total Resume Analyses</label>
                <p className="analyses-count">{profile.totalAnalyses}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
