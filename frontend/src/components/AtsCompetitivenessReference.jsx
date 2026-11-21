import React from 'react';
import { Target, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const AtsCompetitivenessReference = ({
  title = 'ATS Competitiveness Benchmark Scale',
  subtitle = 'Reference standards used by modern ATS scoring engines',
  compact = false,
}) => {
  return (
    <div className={`ats-competitiveness-card ${compact ? 'compact' : ''}`}>
      <div className="ats-comp-header">
        <div className="ats-comp-title-group">
          <Target size={compact ? 16 : 18} className="text-gold" />
          <div>
            <h4>{title}</h4>
            <span className="ats-comp-subtitle">{subtitle}</span>
          </div>
        </div>
        <span className="comp-info-pill">
          <Info size={12} />
          ATS Verified
        </span>
      </div>

      <div className="ats-comp-grid">
        {/* Tier 1: High */}
        <div className="ats-tier-item high">
          <div className="ats-tier-top">
            <span className="ats-tier-badge high">
              <CheckCircle2 size={13} />
              High Competitiveness
            </span>
            <span className="ats-tier-range text-emerald">80–99</span>
          </div>
          <p className="ats-tier-desc">
            Strong keyword match, measurable achievements, and clean ATS structure.
          </p>
        </div>

        {/* Tier 2: Moderate */}
        <div className="ats-tier-item moderate">
          <div className="ats-tier-top">
            <span className="ats-tier-badge moderate">
              <AlertTriangle size={13} />
              Moderate Competitiveness
            </span>
            <span className="ats-tier-range text-gold">50–79</span>
          </div>
          <p className="ats-tier-desc">
            Partial keyword match or unquantified experience bullets.
          </p>
        </div>

        {/* Tier 3: Low */}
        <div className="ats-tier-item low">
          <div className="ats-tier-top">
            <span className="ats-tier-badge low">
              <AlertCircle size={13} />
              Low Competitiveness
            </span>
            <span className="ats-tier-range text-danger">20–49</span>
          </div>
          <p className="ats-tier-desc">
            Significant keyword gaps, missing skills, or parsing issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AtsCompetitivenessReference;
