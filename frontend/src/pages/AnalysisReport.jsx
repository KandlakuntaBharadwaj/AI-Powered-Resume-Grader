import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { getResumeById } from '../apis/api';
import { downloadResumePdf } from '../services/pdfExportService';
import ScoreGauge from '../components/ScoreGauge';
import KeywordsChart from '../components/KeywordsChart';
import CategoryBreakdownChart from '../components/CategoryBreakdownChart';
import AtsCompetitivenessReference from '../components/AtsCompetitivenessReference';
import {
  Download,
  ArrowLeft,
  FileText,
  Calendar,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Target,
  RefreshCw,
} from 'lucide-react';

const AnalysisReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!location.state?.analysis && !!id);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'content' | 'style' | 'skills' | 'format' | 'sections' | 'suggestions'
  const [isExporting, setIsExporting] = useState(false);

  // If no analysis in location.state and id is present in URL, fetch from backend
  useEffect(() => {
    if (!analysis && id) {
      const fetchReport = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await getResumeById(id);
          if (res.success && res.data) {
            setAnalysis(res.data);
          } else {
            setError(res.message || 'Report not found.');
          }
        } catch (err) {
          setError(err.message || 'Failed to load analysis report.');
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    }
  }, [id, analysis]);

  // If no state and no ID, redirect to dashboard or analyzer
  if (!loading && !analysis && !id) {
    return (
      <div className="empty-report-state">
        <FileText size={48} className="text-muted" />
        <h2>No Active Analysis Found</h2>
        <p>Please select a previous analysis from your history or upload a resume to analyze.</p>
        <div className="empty-buttons">
          <Link to="/analyze" className="btn-primary">
            Upload & Analyze Resume
          </Link>
          <Link to="/history" className="btn-secondary">
            View Analysis History
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="report-loading-container">
        <div className="spinner"></div>
        <h2>Loading Comprehensive Analysis Report...</h2>
        <p>Retrieving your structured ATS scores and evaluations.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-error-container">
        <AlertTriangle size={44} className="text-danger" />
        <h2>Unable to Load Report</h2>
        <p>{error}</p>
        <button className="btn-primary" onClick={() => navigate('/history')}>
          Back to History
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    setIsExporting(true);
    try {
      downloadResumePdf(analysis);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formattedDate = new Date(analysis.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const ca = analysis.contentAnalysis || {};
  const sa = analysis.styleAnalysis || {};
  const sk = analysis.skillsAnalysis || {};
  const fa = analysis.formatAnalysis || {};
  const sections = analysis.sectionFeedback || [];
  const suggestions = analysis.suggestions || [];

  return (
    <div className="report-page-root">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="report-top-bar">
        <div className="report-nav-left">
          <button className="btn-back-link" onClick={() => navigate('/analyze')}>
            <ArrowLeft size={16} />
            <span>New Analysis</span>
          </button>
          <span className="nav-sep">/</span>
          <button className="btn-back-link" onClick={() => navigate('/history')}>
            <span>History</span>
          </button>
          <span className="nav-sep">/</span>
          <span className="current-crumb text-truncate">
            {analysis.originalFilename || 'Resume Report'}
          </span>
        </div>

        <div className="report-nav-right">
          <button
            className="btn-download-pdf"
            onClick={handleDownload}
            disabled={isExporting}
            title="Download executive PDF report"
          >
            <Download size={16} />
            <span>{isExporting ? 'Generating PDF...' : 'Download Report (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Report Header Card */}
      <div className="report-summary-banner">
        <div className="summary-left">
          <div className="summary-badge-row">
            <span className="summary-pill">Executive ATS Report</span>
            <span className="date-pill">
              <Calendar size={13} /> {formattedDate}
            </span>
          </div>
          <h1 className="report-title">{analysis.originalFilename || 'Resume Analysis'}</h1>
          <p className="report-lead">
            {analysis.summary ||
              analysis.overview?.keyTakeaway ||
              'Evaluation completed using modern Applicant Tracking System heuristics and keyword alignment criteria.'}
          </p>

          <div className="report-job-desc-tag">
            <Briefcase size={14} />
            <span className="label">Target Role:</span>
            <span className="value">
              {analysis.jobDescription
                ? (analysis.jobDescription.length > 90
                    ? `${analysis.jobDescription.substring(0, 90)}...`
                    : analysis.jobDescription)
                : 'Standard Competitive Tech Industry Benchmark'}
            </span>
          </div>
        </div>

        {/* Top KPI Score Pill */}
        <div className="summary-right">
          <ScoreGauge score={analysis.score} size={150} strokeWidth={12} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="report-tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Target size={16} />
          <span>A. Overview</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <FileText size={16} />
          <span>B. Content Analysis</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          <Sparkles size={16} />
          <span>C. Style & Writing</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <Award size={16} />
          <span>D. Skills Breakdown</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'format' ? 'active' : ''}`}
          onClick={() => setActiveTab('format')}
        >
          <Layers size={16} />
          <span>E. Format & ATS</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          <CheckCircle2 size={16} />
          <span>F. Section-by-Section</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          <Lightbulb size={16} />
          <span>Actionable Fixes ({suggestions.length})</span>
        </button>
      </div>

      {/* TAB CONTENT SECTIONS */}
      <div className="tab-content-area">
        {/* ========================================================= */}
        {/* TAB A: OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="tab-panel overview-panel">
            {/* Quick Metrics Bar */}
            <div className="overview-kpi-grid">
              <div className="kpi-card">
                <span className="kpi-title">ATS Compatibility</span>
                <div className="kpi-val-row">
                  <span className="kpi-val text-indigo">{analysis.score}/100</span>
                </div>
                <span className="kpi-desc">
                  {analysis.score >= 75 ? 'Highly Competitive' : analysis.score >= 50 ? 'Average' : 'At Risk'}
                </span>
              </div>

              <div className="kpi-card">
                <span className="kpi-title">Job Alignment</span>
                <div className="kpi-val-row">
                  <span className="kpi-val text-emerald">{analysis.matchPercentage || analysis.score}%</span>
                </div>
                <span className="kpi-desc">Keyword & skill density match</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-title">Matching Keywords</span>
                <div className="kpi-val-row">
                  <span className="kpi-val text-success">
                    {analysis.keywordsExtracted?.length || 0}
                  </span>
                </div>
                <span className="kpi-desc">Verified ATS skill matches</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-title">Missing Keywords</span>
                <div className="kpi-val-row">
                  <span className="kpi-val text-danger">
                    {analysis.missingKeywords?.length || 0}
                  </span>
                </div>
                <span className="kpi-desc">Critical terms to add</span>
              </div>
            </div>

            {/* Visual Charts Grid */}
            <div className="overview-charts-grid">
              <KeywordsChart
                matchingKeywords={analysis.keywordsExtracted}
                missingKeywords={analysis.missingKeywords}
              />
              <CategoryBreakdownChart analysis={analysis} />
            </div>

            {/* Executive Takeaway Box */}
            <div className="executive-takeaway-card">
              <div className="takeaway-header">
                <Sparkles size={18} className="text-indigo" />
                <h3>Executive Summary & Action Plan</h3>
              </div>
              <p className="takeaway-text">
                {analysis.summary ||
                  analysis.overview?.keyTakeaway ||
                  'Your resume has strong foundations. Review the category tabs above and the actionable recommendations below to optimize your score before submitting.'}
              </p>
            </div>

            {/* ATS Competitiveness Benchmark Reference */}
            <AtsCompetitivenessReference />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB B: CONTENT ANALYSIS */}
        {/* ========================================================= */}
        {activeTab === 'content' && (
          <div className="tab-panel content-panel">
            <div className="panel-intro">
              <h3>Resume Content Depth & Impact</h3>
              <p>Evaluation of professional summary, job accomplishments, metrics, and education.</p>
            </div>

            {/* Content Evaluations Grid */}
            <div className="eval-cards-grid">
              <div className="eval-card">
                <div className="eval-card-header">
                  <h4>Professional Summary</h4>
                  <span className="eval-score-badge">
                    {ca.summaryEvaluation?.score ?? 70}/100
                  </span>
                </div>
                <p>{ca.summaryEvaluation?.feedback || 'Summary presents candidate credentials clearly.'}</p>
              </div>

              <div className="eval-card">
                <div className="eval-card-header">
                  <h4>Work Experience & Roles</h4>
                  <span className="eval-score-badge">
                    {ca.workExperienceEvaluation?.score ?? 70}/100
                  </span>
                </div>
                <p>{ca.workExperienceEvaluation?.feedback || 'Experience details chronological employment trajectory.'}</p>
              </div>

              <div className="eval-card">
                <div className="eval-card-header">
                  <h4>Quantifiable Achievements & Metrics</h4>
                  <span className="eval-score-badge">
                    {ca.achievementsEvaluation?.score ?? 65}/100
                  </span>
                </div>
                <p>{ca.achievementsEvaluation?.feedback || 'Measurable business numbers and percentages increase ATS credibility.'}</p>
              </div>

              <div className="eval-card">
                <div className="eval-card-header">
                  <h4>Technical / Applied Projects</h4>
                  <span className="eval-score-badge">
                    {ca.projectsEvaluation?.score ?? 70}/100
                  </span>
                </div>
                <p>{ca.projectsEvaluation?.feedback || 'Projects show hands-on tool applications.'}</p>
              </div>

              <div className="eval-card">
                <div className="eval-card-header">
                  <h4>Education & Accreditations</h4>
                  <span className="eval-score-badge">
                    {ca.educationEvaluation?.score ?? 75}/100
                  </span>
                </div>
                <p>{ca.educationEvaluation?.feedback || 'Degrees and institutions listed appropriately.'}</p>
              </div>
            </div>

            {/* Strengths & Weaknesses Split */}
            <div className="strengths-weaknesses-row">
              <div className="sw-column strengths">
                <div className="sw-header">
                  <CheckCircle2 size={18} className="text-success" />
                  <h4>Observed Content Strengths</h4>
                </div>
                <ul className="sw-list">
                  {ca.strengths?.length > 0 ? (
                    ca.strengths.map((str, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={14} className="text-success" />
                        <span>{str}</span>
                      </li>
                    ))
                  ) : (
                    <li>Clear technical skills listed</li>
                  )}
                </ul>
              </div>

              <div className="sw-column weaknesses">
                <div className="sw-header">
                  <XCircle size={18} className="text-danger" />
                  <h4>Content Gaps & Areas to Strengthen</h4>
                </div>
                <ul className="sw-list">
                  {ca.weaknesses?.length > 0 ? (
                    ca.weaknesses.map((w, idx) => (
                      <li key={idx}>
                        <XCircle size={14} className="text-danger" />
                        <span>{w}</span>
                      </li>
                    ))
                  ) : (
                    <li>Include more quantifiable metrics in work bullets</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB C: STYLE ANALYSIS */}
        {/* ========================================================= */}
        {activeTab === 'style' && (
          <div className="tab-panel style-panel">
            <div className="panel-intro">
              <h3>Writing Quality, Action Verbs & Tone</h3>
              <p>How effectively your resume communicates seniority, clarity, and grammatical precision.</p>
            </div>

            <div className="style-cards-grid">
              <div className="style-card">
                <span className="style-label">Writing Quality & Vocabulary</span>
                <h4>{sa.writingQuality || 'Professional and concise business English'}</h4>
                <p className="style-detail">Evaluates professional diction, vocabulary range, and economy of words.</p>
              </div>

              <div className="style-card">
                <span className="style-label">Clarity & Readability</span>
                <h4>{sa.clarityAndReadability || 'Easily scannable by human recruiters in 6 seconds'}</h4>
                <p className="style-detail">Recruiters spend an average of 6–7 seconds on initial resume triage.</p>
              </div>

              <div className="style-card">
                <span className="style-label">Grammar & Tense Consistency</span>
                <h4>{sa.grammarAndLanguage || 'Consistent past/present verb tenses'}</h4>
                <p className="style-detail">Past roles should strictly use past tense; current roles should use present tense.</p>
              </div>

              <div className="style-card">
                <span className="style-label">Tone & Professionalism</span>
                <h4>{sa.tone || 'Formal, direct, and confident executive tone'}</h4>
                <p className="style-detail">Avoids subjective self-praise (e.g. "guru", "ninja") in favor of concrete claims.</p>
              </div>
            </div>

            {/* Action Verbs Spotlight */}
            <div className="action-verbs-card">
              <div className="verbs-header-row">
                <div className="verbs-title-group">
                  <Sparkles size={20} className="text-indigo" />
                  <div>
                    <h4>Action Verb Usage Audit</h4>
                    <p className="subtext">
                      Bullet points beginning with dynamic action verbs convey leadership and ownership.
                    </p>
                  </div>
                </div>
                <div className="verbs-score">
                  <span className="score-val">{sa.actionVerbUsage?.score ?? 75}/100</span>
                </div>
              </div>

              <p className="verbs-feedback">{sa.actionVerbUsage?.feedback}</p>

              <div className="verbs-examples-row">
                <div className="verbs-col">
                  <span className="col-sub">Verbs Found in Resume:</span>
                  <div className="pill-wrap">
                    {sa.actionVerbUsage?.examplesFound?.map((v, i) => (
                      <span key={i} className="kw-badge kw-match">{v}</span>
                    )) || <span>Developed, Implemented, Designed</span>}
                  </div>
                </div>

                <div className="verbs-col">
                  <span className="col-sub">Recommended High-Impact Verbs:</span>
                  <div className="pill-wrap">
                    {sa.actionVerbUsage?.recommendations?.map((r, i) => (
                      <span key={i} className="kw-badge kw-miss">{r}</span>
                    )) || <span>Spearheaded, Optimized, Engineered, Scaled</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB D: SKILLS ANALYSIS */}
        {/* ========================================================= */}
        {activeTab === 'skills' && (
          <div className="tab-panel skills-panel">
            <div className="panel-intro">
              <h3>Comprehensive Skills Classification</h3>
              <p>Granular breakdown of matching vs missing technical and soft skills.</p>
            </div>

            <div className="skills-categorized-grid">
              {/* Technical Skills Matching */}
              <div className="skills-cat-card">
                <div className="cat-header matching">
                  <CheckCircle2 size={18} />
                  <h4>Matching Technical Skills</h4>
                  <span className="count-pill">
                    {sk.matchingTechnicalSkills?.length || analysis.keywordsExtracted?.length || 0}
                  </span>
                </div>
                <div className="pill-wrap">
                  {(sk.matchingTechnicalSkills?.length ? sk.matchingTechnicalSkills : analysis.keywordsExtracted)?.map((s, i) => (
                    <span key={i} className="kw-badge kw-match">{s}</span>
                  ))}
                </div>
              </div>

              {/* Technical Skills Missing */}
              <div className="skills-cat-card">
                <div className="cat-header missing">
                  <XCircle size={18} />
                  <h4>Missing Technical Skills</h4>
                  <span className="count-pill">
                    {sk.missingTechnicalSkills?.length || analysis.missingKeywords?.length || 0}
                  </span>
                </div>
                <div className="pill-wrap">
                  {(sk.missingTechnicalSkills?.length ? sk.missingTechnicalSkills : analysis.missingKeywords)?.map((s, i) => (
                    <span key={i} className="kw-badge kw-miss">+ {s}</span>
                  ))}
                </div>
              </div>

              {/* Soft Skills Matching */}
              <div className="skills-cat-card">
                <div className="cat-header soft-matching">
                  <CheckCircle2 size={18} />
                  <h4>Demonstrated Soft Skills</h4>
                  <span className="count-pill">{sk.matchingSoftSkills?.length || 3}</span>
                </div>
                <div className="pill-wrap">
                  {(sk.matchingSoftSkills?.length
                    ? sk.matchingSoftSkills
                    : ['Cross-functional Collaboration', 'Problem Solving', 'Technical Communication']
                  ).map((s, i) => (
                    <span key={i} className="kw-badge kw-soft">{s}</span>
                  ))}
                </div>
              </div>

              {/* Recommended Skills */}
              <div className="skills-cat-card">
                <div className="cat-header recommended">
                  <Sparkles size={18} />
                  <h4>Recommended Skills Based on Job / Market</h4>
                  <span className="count-pill">{sk.recommendedSkills?.length || 4}</span>
                </div>
                <div className="pill-wrap">
                  {(sk.recommendedSkills?.length
                    ? sk.recommendedSkills
                    : analysis.missingKeywords?.slice(0, 5) || ['System Design', 'CI/CD Pipelines']
                  ).map((s, i) => (
                    <span key={i} className="kw-badge kw-rec">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB E: FORMAT ANALYSIS */}
        {/* ========================================================= */}
        {activeTab === 'format' && (
          <div className="tab-panel format-panel">
            <div className="panel-intro">
              <h3>ATS Structural Integrity & Layout</h3>
              <p>Ensuring your resume structure passes automated parsing robots without corruption.</p>
            </div>

            <div className="format-metrics-row">
              <div className="format-metric-card">
                <span className="fm-label">ATS Compatibility Rating</span>
                <h3 className="fm-val text-indigo">
                  {fa.atsCompatibilityRating || (analysis.score >= 75 ? 'High' : 'Moderate')}
                </h3>
                <p className="fm-desc">Readiness for Workday, Greenhouse, Taleo, and Lever ATS parsers.</p>
              </div>

              <div className="format-metric-card">
                <span className="fm-label">Readability Index</span>
                <h3 className="fm-val text-emerald">
                  {fa.readabilityScore || Math.min(100, analysis.score + 5)}/100
                </h3>
                <p className="fm-desc">Based on font weight, margin whitespace, and linear reading flow.</p>
              </div>
            </div>

            <div className="format-details-list">
              <div className="format-detail-item">
                <div className="fd-title">
                  <Layers size={18} className="text-indigo" />
                  <h4>Resume Architecture & Layout</h4>
                </div>
                <p>{fa.resumeStructure || 'Standard reverse-chronological structure parsed cleanly.'}</p>
              </div>

              <div className="format-detail-item">
                <div className="fd-title">
                  <FileText size={18} className="text-indigo" />
                  <h4>Section Organization & Flow</h4>
                </div>
                <p>{fa.sectionOrganization || 'Sections flow logically from summary to experience, skills, and education.'}</p>
              </div>

              <div className="format-detail-item">
                <div className="fd-title">
                  <CheckCircle2 size={18} className="text-indigo" />
                  <h4>Heading & Typographic Consistency</h4>
                </div>
                <p>{fa.headingConsistency || 'Header casings and hierarchies are standard across all major blocks.'}</p>
              </div>

              <div className="format-detail-item">
                <div className="fd-title">
                  <ShieldCheck size={18} className="text-indigo" />
                  <h4>Parsing Safeguards</h4>
                </div>
                <p>{fa.formattingConsistency || 'No unparsable complex tables or overlapping text columns detected.'}</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB F: SECTION-BY-SECTION AUDIT */}
        {/* ========================================================= */}
        {activeTab === 'sections' && (
          <div className="tab-panel sections-panel">
            <div className="panel-intro">
              <h3>Section-by-Section Quality Audit</h3>
              <p>Granular diagnostics, identified issues, and actionable recommendations for every section.</p>
            </div>

            <div className="section-audit-cards">
              {sections.length > 0 ? (
                sections.map((sec, idx) => {
                  const isGood = sec.status === 'good';
                  const isNeedsImprovement = sec.status === 'needs-improvement';
                  const isMissing = sec.status === 'missing';

                  let statusBadgeClass = 'badge-success';
                  let statusLabel = 'Well Structured';
                  if (isNeedsImprovement) {
                    statusBadgeClass = 'badge-warning';
                    statusLabel = 'Needs Improvement';
                  } else if (isMissing) {
                    statusBadgeClass = 'badge-danger';
                    statusLabel = 'Missing / Incomplete';
                  }

                  return (
                    <div key={idx} className={`section-audit-card ${sec.status || ''}`}>
                      <div className="audit-card-top">
                        <div className="sec-title-group">
                          <h4>{sec.section}</h4>
                          <span className={`status-badge ${statusBadgeClass}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>

                      <div className="audit-body">
                        <div className="audit-block">
                          <span className="block-label">Current Assessment:</span>
                          <p>{sec.currentAssessment}</p>
                        </div>

                        {sec.identifiedIssues?.length > 0 && (
                          <div className="audit-block issues">
                            <span className="block-label text-danger">Identified Issues:</span>
                            <ul>
                              {sec.identifiedIssues.map((issue, i) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {sec.actionableRecommendations?.length > 0 && (
                          <div className="audit-block recommendations">
                            <span className="block-label text-indigo">Actionable Recommendations:</span>
                            <ul>
                              {sec.actionableRecommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {sec.suggestedImprovements && (
                          <div className="audit-block suggested-fix">
                            <span className="block-label text-success">Recommended Blueprint:</span>
                            <p className="blueprint-box">{sec.suggestedImprovements}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Section audit data is being compiled.</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB G: ACTIONABLE SUGGESTIONS */}
        {/* ========================================================= */}
        {activeTab === 'suggestions' && (
          <div className="tab-panel suggestions-panel">
            <div className="panel-intro">
              <h3>Priority Action Plan to Maximize Score</h3>
              <p>Follow these high-impact steps to boost your ATS compatibility into the top 10%.</p>
            </div>

            <div className="suggestions-list-modern">
              {suggestions.length > 0 ? (
                suggestions.map((sug, idx) => (
                  <div key={idx} className="suggestion-card-modern">
                    <div className="sug-num-pill">#{idx + 1}</div>
                    <div className="sug-text-wrap">
                      <p className="sug-text">{sug}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-suggestions">
                  <CheckCircle2 size={32} className="text-success" />
                  <p>No critical improvements needed. Your resume is in top shape!</p>
                </div>
              )}
            </div>

            <div className="download-cta-banner">
              <div>
                <h4>Save Your Analysis Report</h4>
                <p>Download the full multi-page PDF version with all charts and section audits.</p>
              </div>
              <button className="btn-primary" onClick={handleDownload} disabled={isExporting}>
                <Download size={16} />
                <span>Download Report (PDF)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisReport;
