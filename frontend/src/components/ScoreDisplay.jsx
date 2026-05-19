import React from 'react';

const ScoreDisplay = ({ score }) => {
  // Determine color based on score
  let colorClass = 'score-low';
  if (score >= 80) colorClass = 'score-high';
  else if (score >= 50) colorClass = 'score-medium';

  return (
    <div className="score-container">
      <h2>ATS Match Score</h2>
      <div className={`score-circle ${colorClass}`}>
        <span className="score-text">{score}</span>
        <span className="score-max">/100</span>
      </div>
      <p className="score-description">
        {score >= 80 ? 'Excellent! Your resume is highly optimized.' :
         score >= 50 ? 'Good, but there is room for improvement.' :
         'Needs significant improvements to pass ATS filters.'}
      </p>
    </div>
  );
};

export default ScoreDisplay;
