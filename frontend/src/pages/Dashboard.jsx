import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../apis/api';
import { downloadResumePdf } from '../services/pdfExportService';
import {
  UploadCloud,
  FileText,
  Calendar,
  Award,
  ArrowRight,
  TrendingUp,
  Download,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalAnalyses: 0,
    latestScore: 0,
    averageScore: 0,
    highestScore: 0,
    recentAnalyses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Could not load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 75) return 'score-high-badge';
    if (score >= 50) return 'score-medium-badge';
    return 'score-low-badge';
  };

  return (
    <div className="dashboard-page-root">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-badge">
            <Sparkles size={14} className="text-indigo" />
            <span>Candidate Workspace</span>
          </div>
          <h1>Welcome back, {user?.name || 'Professional'}!</h1>
          <p className="welcome-sub">
            Track your ATS readiness, review historical resume grades, and optimize your application materials.
          </p>
        </div>

        <div className="welcome-action">
          <Link to="/analyze" className="btn-primary btn-action-analyze">
            <UploadCloud size={18} />
            <span>Analyze New Resume</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-metric-card">
          <div className="kpi-icon-wrap bg-indigo">
            <FileText size={20} className="text-indigo" />
          </div>
          <div className="kpi-info">
            <span className="kpi-title">Total Resumes Analyzed</span>
            <h2 className="kpi-num">{stats.totalAnalyses}</h2>
            <span className="kpi-sub">Lifetime audit submissions</span>
          </div>
        </div>

        <div className="kpi-metric-card">
          <div className="kpi-icon-wrap bg-emerald">
            <Award size={20} className="text-emerald" />
          </div>
          <div className="kpi-info">
            <span className="kpi-title">Latest ATS Score</span>
            <h2 className="kpi-num text-emerald">
              {stats.totalAnalyses > 0 ? `${stats.latestScore}/100` : '—'}
            </h2>
            <span className="kpi-sub">
              {stats.latestScore >= 75
                ? 'Strong ATS alignment'
                : stats.latestScore >= 50
                ? 'Moderate performance'
                : 'Optimization needed'}
            </span>
          </div>
        </div>

        <div className="kpi-metric-card">
          <div className="kpi-icon-wrap bg-sky">
            <BarChart3 size={20} className="text-sky" />
          </div>
          <div className="kpi-info">
            <span className="kpi-title">Average Score</span>
            <h2 className="kpi-num text-sky">
              {stats.totalAnalyses > 0 ? `${stats.averageScore}/100` : '—'}
            </h2>
            <span className="kpi-sub">Across all uploaded drafts</span>
          </div>
        </div>

        <div className="kpi-metric-card">
          <div className="kpi-icon-wrap bg-amber">
            <TrendingUp size={20} className="text-amber" />
          </div>
          <div className="kpi-info">
            <span className="kpi-title">Highest Score</span>
            <h2 className="kpi-num text-amber">
              {stats.totalAnalyses > 0 ? `${stats.highestScore}/100` : '—'}
            </h2>
            <span className="kpi-sub">Best performing candidate draft</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="dashboard-main-layout">
        {/* Left Column: Recent Analyses */}
        <div className="recent-analyses-panel">
          <div className="panel-header-row">
            <div>
              <h3>Recent Analyses</h3>
              <p className="subtitle">Your latest evaluated resumes and performance scores</p>
            </div>
            {stats.totalAnalyses > 0 && (
              <Link to="/history" className="view-all-link">
                <span>View Full History</span>
                <ArrowRight size={15} />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="panel-loading">
              <div className="spinner sm"></div>
              <span>Loading recent analyses...</span>
            </div>
          ) : stats.recentAnalyses?.length > 0 ? (
            <div className="recent-list">
              {stats.recentAnalyses.map((item) => (
                <div
                  key={item._id}
                  className="recent-item-card"
                  onClick={() => navigate(`/results/${item._id}`)}
                >
                  <div className="recent-left">
                    <div className="pdf-doc-icon">
                      <FileText size={22} className="text-indigo" />
                    </div>
                    <div className="recent-meta">
                      <h4 className="doc-title">{item.originalFilename}</h4>
                      <div className="doc-subinfo">
                        <span className="doc-date">
                          <Calendar size={13} /> {formatDate(item.createdAt)}
                        </span>
                        {item.jobDescription && (
                          <>
                            <span className="dot-sep">•</span>
                            <span className="doc-job text-truncate">
                              Job: {item.jobDescription.substring(0, 40)}...
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="recent-right">
                    <div className={`score-badge ${getScoreBadgeClass(item.score)}`}>
                      <Award size={14} />
                      <span>{item.score}/100</span>
                    </div>

                    <button
                      className="btn-view-arrow"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/results/${item._id}`);
                      }}
                      title="Open full analysis report"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-workspace-card">
              <FileText size={44} className="empty-icon" />
              <h4>No resumes analyzed yet</h4>
              <p>Upload your first resume to see ATS scores, keyword match rates, and improvement tips.</p>
              <Link to="/analyze" className="btn-primary" style={{ marginTop: '1rem' }}>
                Analyze Your First Resume
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions & Optimization Guidance */}
        <div className="dashboard-sidebar-panel">
          <div className="quick-action-card">
            <div className="qa-header">
              <Sparkles size={20} className="text-indigo" />
              <h4>Quick Action</h4>
            </div>
            <p>Ready to test another draft or tailor your resume for a specific job application?</p>
            <Link to="/analyze" className="btn-primary full-width">
              <UploadCloud size={17} />
              <span>Analyze Another Resume</span>
            </Link>
          </div>

          <div className="ats-tips-card">
            <h4>Top ATS Optimization Rules</h4>
            <ul className="tips-list">
              <li>
                <CheckCircle2 size={15} className="text-success" />
                <span>Avoid 2-column or table layouts that confuse parsers.</span>
              </li>
              <li>
                <CheckCircle2 size={15} className="text-success" />
                <span>Match exact terminology from target job requirements.</span>
              </li>
              <li>
                <CheckCircle2 size={15} className="text-success" />
                <span>Begin bullet points with strong active leadership verbs.</span>
              </li>
              <li>
                <CheckCircle2 size={15} className="text-success" />
                <span>Always include quantifiable outcomes (e.g. %, $, numbers).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
