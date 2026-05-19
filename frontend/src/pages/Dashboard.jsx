import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import ScoreDisplay from '../components/ScoreDisplay';
import KeywordList from '../components/KeywordList';
import { ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;

  if (!analysis) {
    return <Navigate to="/" />;
  }

  return (
    <div className="dashboard-container">
      <button className="btn-back" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back to Upload
      </button>

      <div className="dashboard-header">
        <h1>Analysis Results</h1>
        <p>Here is how your resume performed against our ATS parameters.</p>
      </div>

      <div className="dashboard-grid">
        <div className="score-panel">
          <ScoreDisplay score={analysis.score} />
        </div>
        
        <div className="details-panel">
          <KeywordList 
            keywordsExtracted={analysis.keywordsExtracted} 
            missingKeywords={analysis.missingKeywords} 
            suggestions={analysis.suggestions} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
