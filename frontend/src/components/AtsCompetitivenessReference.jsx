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
            <span className="ats-tier-range text-emerald">80–99</span>
          </div>
          <p className="ats-tier-desc">
            Resumes with strong job-description keyword alignment, measurable achievements, relevant skills, and a well-structured, ATS-friendly format receive higher scores (e.g., 87, 91, 96).
          </p>
        </div>

        {/* Tier 2: Moderate */}
        <div className="ats-tier-item moderate">
          <div className="ats-tier-top">
            <span className="ats-tier-badge moderate">
              <AlertTriangle size={14} />
              Moderate Competitiveness
            </span>
            <span className="ats-tier-range text-gold">50–79</span>
          </div>
          <p className="ats-tier-desc">
            Resumes with partial keyword alignment, limited measurable achievements, or some missing job-relevant skills receive moderate scores (e.g., 56, 68, 75).
          </p>
        </div>

        {/* Tier 3: Low */}
        <div className="ats-tier-item low">
          <div className="ats-tier-top">
            <span className="ats-tier-badge low">
              <AlertCircle size={14} />
              Low Competitiveness
            </span>
            <span className="ats-tier-range text-danger">20–49</span>
          </div>
          <p className="ats-tier-desc">
            Resumes with significant keyword gaps, missing relevant skills, weak descriptions, or ATS parsing issues receive lower scores (e.g., 28, 38, 45).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AtsCompetitivenessReference;
