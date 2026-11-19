import React, { useState } from 'react';
import { CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

const KeywordsChart = ({ matchingKeywords = [], missingKeywords = [] }) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'matching' | 'missing'
  const [searchTerm, setSearchTerm] = useState('');

  const total = (matchingKeywords?.length || 0) + (missingKeywords?.length || 0);
  const matchCount = matchingKeywords?.length || 0;
  const missingCount = missingKeywords?.length || 0;
  const matchRate = total > 0 ? Math.round((matchCount / total) * 100) : 0;

  // Donut SVG calculations
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const matchDash = total > 0 ? (matchCount / total) * circumference : 0;
  const missingDash = circumference - matchDash;

  const filteredMatching = matchingKeywords.filter((k) =>
    k.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredMissing = missingKeywords.filter((k) =>
    k.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="keywords-chart-card">
      <div className="chart-header">
        <div>
          <h3>Keywords & Skill Alignment</h3>
          <p className="subtitle">Real-time keyword coverage against target ATS criteria</p>
        </div>
        <div className="chart-legend">
          <span className="legend-item match">
            <span className="legend-dot green"></span>
            Found ({matchCount})
          </span>
          <span className="legend-item miss">
            <span className="legend-dot red"></span>
            Missing ({missingCount})
          </span>
        </div>
      </div>

      <div className="chart-visual-row">
        {/* SVG Donut */}
        <div className="donut-wrapper" style={{ width: size, height: size }}>
          <svg width={size} height={size}>
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(239, 68, 68, 0.25)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Matching keywords arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#22C55E"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${matchDash} ${circumference}`}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dasharray 1s ease',
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </svg>
          <div className="donut-center-text">
            <span className="rate-number">{matchRate}%</span>
            <span className="rate-label">Coverage</span>
          </div>
        </div>

        {/* Progress Breakdown Bar */}
        <div className="breakdown-details">
          <div className="ratio-bar-container">
            <div className="ratio-bar">
              <div
                className="ratio-fill match"
                style={{ width: `${matchRate}%` }}
                title={`${matchCount} matching keywords`}
              ></div>
              <div
                className="ratio-fill miss"
                style={{ width: `${100 - matchRate}%` }}
                title={`${missingCount} missing keywords`}
              ></div>
            </div>
            <div className="ratio-labels">
              <span>{matchCount} Match ({matchRate}%)</span>
              <span>{missingCount} Missing ({100 - matchRate}%)</span>
            </div>
          </div>

          <p className="chart-guidance">
            {matchRate >= 75
              ? 'Excellent keyword coverage! Your resume matches the key criteria recruiters and ATS algorithms scan for.'
              : matchRate >= 50
              ? 'Good foundation, but integrating the missing high-priority keywords below will significantly increase your interview callback rate.'
              : 'Low keyword coverage. Automated ATS filters will likely drop this resume before human review.'}
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="keyword-filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Filter keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`btn-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({total})
          </button>
          <button
            className={`btn-pill match ${filter === 'matching' ? 'active' : ''}`}
            onClick={() => setFilter('matching')}
          >
            Matching ({matchCount})
          </button>
          <button
            className={`btn-pill miss ${filter === 'missing' ? 'active' : ''}`}
            onClick={() => setFilter('missing')}
          >
            Missing ({missingCount})
          </button>
        </div>
      </div>

      {/* Keyword Pills Display */}
      <div className="keyword-lists-grid">
        {(filter === 'all' || filter === 'matching') && (
          <div className="keyword-group matching-group">
            <div className="group-title">
              <CheckCircle2 size={16} className="text-success" />
              <span>Matching Keywords Found</span>
            </div>
            <div className="pill-wrap">
              {filteredMatching.length > 0 ? (
                filteredMatching.map((kw, i) => (
                  <span key={i} className="kw-badge kw-match">
                    {kw}
                  </span>
                ))
              ) : (
                <p className="empty-subtext">No matching keywords in this view.</p>
              )}
            </div>
          </div>
        )}

        {(filter === 'all' || filter === 'missing') && (
          <div className="keyword-group missing-group">
            <div className="group-title">
              <XCircle size={16} className="text-danger" />
              <span>Recommended Missing Keywords</span>
            </div>
            <div className="pill-wrap">
              {filteredMissing.length > 0 ? (
                filteredMissing.map((kw, i) => (
                  <span key={i} className="kw-badge kw-miss">
                    + {kw}
                  </span>
                ))
              ) : (
                <p className="empty-subtext">No missing keywords in this view.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordsChart;
