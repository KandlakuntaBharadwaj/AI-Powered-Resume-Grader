import React from 'react';
import { Target, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const AtsCompetitivenessReference = ({ title = 'ATS Competitiveness Benchmark Scale', subtitle = 'Reference standards used by modern ATS scoring engines' }) => {
  return (
    <div className="ats-competitiveness-card">
      <div className="ats-comp-header">
        <div className="ats-comp-title-group">
          <Target size={18} className="text-gold" />
          <div>
            <h4>{title}</h4>
            <span className="ats-comp-subtitle">{subtitle}</span>
          </div>
        </div>
        <span className="comp-info-pill">
          <Info size={13} />
          ATS Verified
        </span>
      </div>

      <div className="ats-comp-grid">
        {/* Tier 1: High */}
        <div className="ats-tier-item high">
          <div className="ats-tier-top">
            <span className="ats-tier-badge high">
              <CheckCircle2 size={14} />
              High Competitiveness
            </span>
            <span className="ats-tier-range text-emerald">80–98</span>
          </div>
          <p className="ats-tier-desc">
            Resumes with strong keyword alignment, clear metrics, and clean structure now receive the high scores they deserve (e.g., 87, 91, 94).
          </p>
        </div>

        {/* Tier 2: Moderate */}
        <div className="ats-tier-item moderate">
          <div className="ats-tier-top">
            <span className="ats-tier-badge moderate">
              <AlertTriangle size={14} />
              Moderate Competitiveness
            </span>
            <span className="ats-tier-range text-gold">60–84</span>
          </div>
          <p className="ats-tier-desc">
            Resumes with partial keyword match or unquantified bullets are scored naturally.
          </p>
        </div>

        {/* Tier 3: Low */}
        <div className="ats-tier-item low">
          <div className="ats-tier-top">
            <span className="ats-tier-badge low">
              <AlertCircle size={14} />
              Low Competitiveness
            </span>
            <span className="ats-tier-range text-danger">20–59</span>
          </div>
          <p className="ats-tier-desc">
            Resumes with major keyword gaps or poor parsing layouts receive accurate lower scores (e.g., 38, 49, 58).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AtsCompetitivenessReference;
