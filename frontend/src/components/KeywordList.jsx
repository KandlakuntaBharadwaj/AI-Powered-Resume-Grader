import React from 'react';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

const KeywordList = ({ keywordsExtracted, missingKeywords, suggestions }) => {
  return (
    <div className="analysis-details">
      <div className="keywords-section">
        <div className="keyword-box found">
          <h3><CheckCircle2 size={20} /> Found Keywords</h3>
          <div className="pill-container">
            {keywordsExtracted?.length > 0 ? (
              keywordsExtracted.map((kw, i) => (
                <span key={i} className="pill pill-success">{kw}</span>
              ))
            ) : (
              <p>No key skills found.</p>
            )}
          </div>
        </div>
        
        <div className="keyword-box missing">
          <h3><XCircle size={20} /> Missing Keywords</h3>
          <div className="pill-container">
            {missingKeywords?.length > 0 ? (
              missingKeywords.map((kw, i) => (
                <span key={i} className="pill pill-danger">{kw}</span>
              ))
            ) : (
              <p>Looks great! No obvious missing keywords.</p>
            )}
          </div>
        </div>
      </div>

      <div className="suggestions-section">
        <h3><Lightbulb size={20} /> Suggested Improvements</h3>
        <ul className="suggestions-list">
          {suggestions?.length > 0 ? (
            suggestions.map((suggestion, i) => (
              <li key={i}>{suggestion}</li>
            ))
          ) : (
            <li>No specific suggestions at this time.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default KeywordList;
