import React from 'react';

const ScoreGauge = ({ score = 0, size = 180, strokeWidth = 14, label = 'ATS Compatibility Score' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const offset = circumference - (safeScore / 100) * circumference;

  let color = '#EF4444'; // Red (below 50)
  let statusText = 'Needs Significant Work';
  let statusBadge = 'badge-danger';

  if (safeScore >= 80) {
    color = '#22C55E'; // Success Green
    statusText = 'Excellent (ATS Ready)';
    statusBadge = 'badge-success';
  } else if (safeScore >= 65) {
    color = '#FACC15'; // Golden Yellow
    statusText = 'Strong Match';
    statusBadge = 'badge-primary';
  } else if (safeScore >= 50) {
    color = '#F59E0B'; // Warning Amber
    statusText = 'Average / Needs Optimization';
    statusBadge = 'badge-warning';
  }

  return (
    <div className="score-gauge-card">
      <div className="score-gauge-wrapper" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="score-gauge-svg">
          <circle
            className="score-gauge-bg"
            stroke="#303030"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="score-gauge-progress"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        <div className="score-gauge-content">
          <span className="score-number" style={{ color }}>{safeScore}</span>
          <span className="score-total">/100</span>
        </div>
      </div>
      <div className="score-gauge-meta">
        <h4 className="score-label">{label}</h4>
        <span className={`status-badge ${statusBadge}`}>{statusText}</span>
        <p className="score-percentile">
          {safeScore >= 80 ? 'Outperforms 88% of applicants' :
           safeScore >= 65 ? 'Competitive for top roles with tweaks' :
           safeScore >= 50 ? 'Average candidate pool tier' :
           'High risk of rejection by automated filters'}
        </p>
      </div>
    </div>
  );
};

export default ScoreGauge;
