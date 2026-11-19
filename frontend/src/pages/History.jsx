import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteResume } from '../apis/api';
import { downloadResumePdf } from '../services/pdfExportService';
import {
  FileText,
  Calendar,
  Award,
  Briefcase,
  ArrowRight,
  Download,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  UploadCloud,
} from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all'); // 'all' | 'high' | 'medium' | 'low'
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getHistory();
      if (res.success) {
        setHistory(res.data);
      } else {
        setError(res.message || 'Failed to fetch analysis history.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred fetching your history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenAnalysis = (record) => {
    navigate(`/results/${record._id}`, { state: { analysis: record } });
  };

  const handleDownloadPdf = (e, record) => {
    e.stopPropagation();
    try {
      downloadResumePdf(record);
    } catch (err) {
      console.error('PDF error:', err);
      alert('Could not download PDF report.');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      setDeletingId(id);
      const res = await deleteResume(id);
      if (res.success) {
        setHistory((prev) => prev.filter((item) => item._id !== id));
        setDeleteConfirmId(null);
      } else {
        alert(res.message || 'Could not delete resume record.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete record.');
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 75) return 'score-high-badge';
    if (score >= 50) return 'score-medium-badge';
    return 'score-low-badge';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      (item.originalFilename && item.originalFilename.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.jobDescription && item.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (scoreFilter === 'high') return item.score >= 75;
    if (scoreFilter === 'medium') return item.score >= 50 && item.score < 75;
    if (scoreFilter === 'low') return item.score < 50;

    return true;
  });

  return (
    <div className="history-page-root">
      {/* Top Header */}
      <div className="history-header-row">
        <div>
          <h1>Resume Grading Archive</h1>
          <p className="history-subtitle">
            Review previous ATS evaluations, compare score improvements, and download PDF reports.
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/analyze')}>
          <UploadCloud size={16} />
          <span>Analyze New Resume</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="history-filter-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by resume filename or job description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="score-filter-buttons">
          <button
            className={`btn-filter ${scoreFilter === 'all' ? 'active' : ''}`}
            onClick={() => setScoreFilter('all')}
          >
            All Scores ({history.length})
          </button>
          <button
            className={`btn-filter high ${scoreFilter === 'high' ? 'active' : ''}`}
            onClick={() => setScoreFilter('high')}
          >
            High 75+
          </button>
          <button
            className={`btn-filter medium ${scoreFilter === 'medium' ? 'active' : ''}`}
            onClick={() => setScoreFilter('medium')}
          >
            Moderate 50-74
          </button>
          <button
            className={`btn-filter low ${scoreFilter === 'low' ? 'active' : ''}`}
            onClick={() => setScoreFilter('low')}
          >
            Below 50
          </button>
        </div>
      </div>

      {error && (
        <div className="history-error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="history-loading-overlay">
          <div className="spinner"></div>
          <h2>Loading your analysis history...</h2>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="empty-history-card">
          <FileText size={48} className="empty-icon text-muted" />
          <h3>No resume analyses found</h3>
          <p>
            {searchQuery || scoreFilter !== 'all'
              ? 'No evaluations match your search or filter criteria.'
              : 'Analyze your first resume to start tracking your ATS performance history.'}
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              if (searchQuery || scoreFilter !== 'all') {
                setSearchQuery('');
                setScoreFilter('all');
              } else {
                navigate('/analyze');
              }
            }}
            style={{ maxWidth: '240px', marginTop: '1rem' }}
          >
            {searchQuery || scoreFilter !== 'all' ? 'Clear Filters' : 'Analyze a Resume'}
          </button>
        </div>
      ) : (
        <div className="history-cards-grid">
          {filteredHistory.map((record) => (
            <div
              key={record._id}
              className="history-record-card"
              onClick={() => handleOpenAnalysis(record)}
            >
              <div className="record-header">
                <div className="record-file-info">
                  <div className="file-icon-box">
                    <FileText size={20} className="text-indigo" />
                  </div>
                  <div>
                    <h3 className="file-title text-truncate" title={record.originalFilename}>
                      {record.originalFilename}
                    </h3>
                    <div className="record-date">
                      <Calendar size={13} />
                      <span>{formatDate(record.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className={`score-badge ${getScoreClass(record.score)}`}>
                  <Award size={15} />
                  <span>{record.score}/100</span>
                </div>
              </div>

              <div className="record-body">
                <div className="job-desc-snippet">
                  <Briefcase size={14} className="text-muted" />
                  <span className="text-truncate">
                    {record.jobDescription
                      ? `Job: ${record.jobDescription}`
                      : 'Role: General Tech Standard'}
                  </span>
                </div>

                {record.summary && (
                  <p className="record-summary-snippet text-truncate-2">
                    {record.summary}
                  </p>
                )}

                <div className="keywords-count-row">
                  <span className="kw-count-pill match">
                    {record.keywordsExtracted?.length || 0} skills found
                  </span>
                  <span className="kw-count-pill miss">
                    {record.missingKeywords?.length || 0} gaps
                  </span>
                </div>
              </div>

              <div className="record-footer">
                <div className="record-actions-left">
                  <button
                    className="btn-action-icon download"
                    onClick={(e) => handleDownloadPdf(e, record)}
                    title="Download PDF report"
                  >
                    <Download size={15} />
                    <span>PDF</span>
                  </button>

                  {deleteConfirmId === record._id ? (
                    <div className="confirm-delete-box" onClick={(e) => e.stopPropagation()}>
                      <span>Delete?</span>
                      <button
                        className="btn-confirm-yes"
                        onClick={(e) => handleDelete(e, record._id)}
                        disabled={deletingId === record._id}
                      >
                        Yes
                      </button>
                      <button
                        className="btn-confirm-no"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(null);
                        }}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-action-icon delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(record._id);
                      }}
                      title="Delete this analysis"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <button className="btn-view-report">
                  <span>View Report</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
