import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../apis/api';
import { ArrowRight, FileText, Calendar, Award, Briefcase } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getHistory();
        if (res.success) {
          setHistory(res.data);
        } else {
          setError(res.message || 'Failed to fetch history.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred fetching history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleOpenAnalysis = (record) => {
    // Navigate to dashboard and pass the analysis data in state
    navigate('/dashboard', { state: { analysis: record } });
  };

  const getScoreClass = (score) => {
    if (score >= 75) return 'score-high-badge';
    if (score >= 50) return 'score-medium-badge';
    return 'score-low-badge';
  };

  const formatDate = (dateStr) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <h2>Loading your grading history...</h2>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Resume Grading History</h1>
        <p>Review all your previously evaluated resumes and their performance scores.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!error && history.length === 0 ? (
        <div className="empty-history-card">
          <FileText size={48} className="empty-icon" />
          <h3>No resume analyses found</h3>
          <p>Analyze your first resume to start tracking your grading history.</p>
          <button className="btn-primary" onClick={() => navigate('/')} style={{ maxWidth: '250px', marginTop: '1rem' }}>
            Grade A Resume
          </button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((record) => (
            <div 
              key={record._id} 
              className="history-card"
              onClick={() => handleOpenAnalysis(record)}
            >
              <div className="history-card-main">
                <div className="history-info-group">
                  <div className="history-file-title">
                    <FileText size={20} className="file-icon" />
                    <h3>{record.originalFilename}</h3>
                  </div>
                  
                  <div className="history-meta">
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{formatDate(record.createdAt)}</span>
                    </div>
                    <div className="meta-item text-truncate">
                      <Briefcase size={14} />
                      <span className="job-desc-preview">
                        Job Desc: {record.jobDescription ? (
                          record.jobDescription.length > 60 
                            ? `${record.jobDescription.substring(0, 60)}...` 
                            : record.jobDescription
                        ) : 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="history-score-group">
                  <div className={`score-badge ${getScoreClass(record.score)}`}>
                    <Award size={16} />
                    <span>Score: {record.score}/100</span>
                  </div>
                  
                  <button className="btn-view-details">
                    <span>View Report</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
