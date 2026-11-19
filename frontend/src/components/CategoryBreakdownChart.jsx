import React from 'react';
import { Award, FileText, Sparkles, Layers, CheckCircle } from 'lucide-react';

const CategoryBreakdownChart = ({ analysis }) => {
  if (!analysis) return null;

  const score = analysis.score || 0;
  const matchPercentage = analysis.matchPercentage || score;

  // Calculate actual scores from analysis data
  const contentScore = Math.round(
    ((analysis.contentAnalysis?.summaryEvaluation?.score || 70) +
     (analysis.contentAnalysis?.workExperienceEvaluation?.score || 70) +
     (analysis.contentAnalysis?.educationEvaluation?.score || 75) +
     (analysis.contentAnalysis?.projectsEvaluation?.score || 70) +
     (analysis.contentAnalysis?.achievementsEvaluation?.score || 65)) / 5
  );

  const styleScore = analysis.styleAnalysis?.actionVerbUsage?.score || 75;
  const formatScore = analysis.formatAnalysis?.readabilityScore || Math.min(100, score + 5);

  const totalKeywords = (analysis.keywordsExtracted?.length || 0) + (analysis.missingKeywords?.length || 0);
  const skillsScore = totalKeywords > 0
    ? Math.round(((analysis.keywordsExtracted?.length || 0) / totalKeywords) * 100)
    : matchPercentage;

  const categories = [
    {
      name: 'Content & Experience Impact',
      score: contentScore,
      icon: FileText,
      description: 'Quantifiable achievements, role descriptions & education depth',
      color: '#FACC15',
    },
    {
      name: 'ATS Keyword Match',
      score: skillsScore,
      icon: Award,
      description: 'Role-critical skills and terminology match rate',
      color: '#22C55E',
    },
    {
      name: 'Professional Writing & Style',
      score: styleScore,
      icon: Sparkles,
      description: 'Action verbs, tone, grammatical clarity, and conciseness',
      color: '#EAB308',
    },
    {
      name: 'ATS Layout & Readability',
      score: formatScore,
      icon: Layers,
      description: 'Structural hierarchy, heading consistency, and scanability',
      color: '#F59E0B',
    },
  ];

  return (
    <div className="category-breakdown-card">
      <div className="card-header">
        <div>
          <h3>Category Performance Audit</h3>
          <p className="subtitle">Core performance metrics across the 4 pillars of ATS evaluation</p>
        </div>
      </div>

      <div className="category-bars-list">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          let tierClass = 'high';
          if (cat.score < 55) tierClass = 'low';
          else if (cat.score < 75) tierClass = 'medium';

          return (
            <div key={idx} className="category-bar-item">
              <div className="cat-header-row">
                <div className="cat-title-group">
                  <span className="cat-icon-wrap" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                    <Icon size={16} />
                  </span>
                  <div>
                    <h4 className="cat-name">{cat.name}</h4>
                    <span className="cat-desc">{cat.description}</span>
                  </div>
                </div>
                <div className="cat-score-badge">
                  <span className="score-num" style={{ color: cat.color }}>{cat.score}</span>
                  <span className="score-denom">/100</span>
                </div>
              </div>

              <div className="cat-progress-track">
                <div
                  className="cat-progress-fill"
                  style={{
                    width: `${cat.score}%`,
                    backgroundColor: cat.color,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;
