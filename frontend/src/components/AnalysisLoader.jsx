import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  RotateCw,
  Clock,
  Sparkles,
  ExternalLink,
  Zap,
} from 'lucide-react';

const STAGES = [
  { id: 1, label: 'Uploading and validating resume', weight: 12 },
  { id: 2, label: 'Extracting resume content', weight: 12 },
  { id: 3, label: 'Analyzing job description', weight: 12 },
  { id: 4, label: 'Identifying relevant skills', weight: 13 },
  { id: 5, label: 'Checking ATS compatibility', weight: 13 },
  { id: 6, label: 'Calculating matching keywords', weight: 13 },
  { id: 7, label: 'Generating improvement suggestions', weight: 13 },
  { id: 8, label: 'Preparing final report', weight: 12 },
];

const PRO_TIPS = [
  'Pro Tip: Resumes with quantifiable metrics (e.g. "Increased revenue by 24%") score up to 40% higher on ATS filters.',
  'Pro Tip: Avoid headers/footers for vital contact info—some older ATS parsers skip headers entirely.',
  'Pro Tip: Tailoring your resume keywords to each specific job description dramatically improves interview callbacks.',
  'Pro Tip: Standard section titles like "Work Experience" and "Education" are recognized best by automated parsers.',
];

const AnalysisLoader = ({ isAnalyzing, uploadProgress = 0, isFinished = false, error = '', onRetry }) => {
  const [activeStage, setActiveStage] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Rotate tips every 6 seconds
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % PRO_TIPS.length);
    }, 6000);
    return () => clearInterval(tipInterval);
  }, []);

  // Smooth realistic stage simulation up to 92%, jumping to 100% on actual completion
  useEffect(() => {
    if (error) return;

    if (isFinished) {
      setActiveStage(7);
      setProgressPercent(100);
      return;
    }

    if (!isAnalyzing) {
      setActiveStage(0);
      setProgressPercent(0);
      return;
    }

    // Step 1: Uploading reflects real upload progress (0-15%)
    if (uploadProgress > 0 && uploadProgress < 100) {
      setActiveStage(0);
      setProgressPercent(Math.min(15, Math.round(uploadProgress * 0.15)));
      return;
    }

    // Server-side processing simulation through stages 2 to 7 (never falsely reaches 100% until isFinished)
    const interval = setInterval(() => {
      setActiveStage((prevStage) => {
        if (prevStage < 6) {
          const next = prevStage + 1;
          const targetPct = Math.min(88, 15 + next * 12);
          setProgressPercent(targetPct);
          return next;
        } else if (prevStage === 6) {
          setProgressPercent(92);
          return 6;
        }
        return prevStage;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isAnalyzing, isFinished, uploadProgress, error]);

  if (error) {
    const isQuotaError = error.includes('402') || error.toLowerCase().includes('quota') || error.toLowerCase().includes('credits');

    return (
      <div className="analysis-loader-container error-state">
        <div className="loader-card error-card">
          <div className="error-icon-wrapper">
            <AlertCircle size={44} className="text-danger" />
          </div>
          <h2>Analysis Provider Notice</h2>
          <div className="error-description" style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
            {error}
          </div>

          {isQuotaError && (
            <div className="quota-fix-card" style={{
              background: 'var(--surface-card)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1.5rem',
              margin: '1.5rem 0',
              textAlign: 'left',
              width: '100%',
              maxWidth: '560px'
            }}>
              <h4 style={{ color: '#fff', fontSize: '0.98rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={16} className="text-indigo" />
                Quick Free Fix (30 Seconds):
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                Hugging Face requires paid credits for serverless 70B models. You can get <strong>100% free</strong> instant access to the exact same strong model (<strong>Llama 3.3 70B</strong>) by getting a free Groq key:
              </p>
              <ol style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
                <li>Get a free key at <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', textDecoration: 'underline' }}>console.groq.com/keys</a></li>
                <li>Add <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#a5b4fc' }}>GROQ_API_KEY=gsk_...</code> to <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#a5b4fc' }}>backend/.env</code></li>
                <li>Or recharge pre-paid credits on <a href="https://huggingface.co/settings/billing" target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', textDecoration: 'underline' }}>Hugging Face Billing</a></li>
              </ol>
            </div>
          )}

          <div className="error-actions" style={{ marginTop: '0.5rem' }}>
            <button className="btn-primary btn-retry" onClick={onRetry}>
              <RotateCw size={16} />
              <span>Retry Analysis</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="analysis-loader-container">
      <div className="loader-card">
        {/* Top Header */}
        <div className="loader-header">
          <div className="pulse-indicator">
            <Sparkles size={20} className="pulse-icon text-indigo" />
          </div>
          <h2>Analyzing Your Resume with AI</h2>
          <div className="time-estimate">
            <Clock size={14} />
            <span>This usually takes 1–2 minutes.</span>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="circular-progress-wrap">
          <svg width={150} height={150} className="progress-ring-svg">
            <circle
              className="progress-ring-bg"
              stroke="#e2e8f0"
              strokeWidth={10}
              fill="transparent"
              r={radius}
              cx={75}
              cy={75}
            />
            <circle
              className="progress-ring-fill"
              stroke="#4f46e5"
              strokeWidth={10}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx={75}
              cy={75}
              style={{
                transition: 'stroke-dashoffset 0.8s ease',
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </svg>
          <div className="ring-content">
            <span className="percent-val">{progressPercent}%</span>
            <span className="percent-label">
              {progressPercent === 100 ? 'Complete!' : 'Processing'}
            </span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="linear-progress-bar-container">
          <div className="linear-progress-track">
            <div
              className="linear-progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Current Active Stage Announcement */}
        <div className="active-stage-banner">
          <Loader2 size={18} className="spinner-icon text-indigo" />
          <span className="active-stage-text">
            Stage {activeStage + 1} of {STAGES.length}: {STAGES[activeStage]?.label}...
          </span>
        </div>

        {/* All 8 Sequential Analysis Stages */}
        <div className="stages-checklist">
          {STAGES.map((stage, idx) => {
            const isCompleted = isFinished || idx < activeStage;
            const isCurrent = !isFinished && idx === activeStage;
            const isPending = !isFinished && idx > activeStage;

            return (
              <div
                key={stage.id}
                className={`stage-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''} ${isPending ? 'pending' : ''}`}
              >
                <div className="stage-status-icon">
                  {isCompleted ? (
                    <CheckCircle2 size={18} className="text-success check-icon" />
                  ) : isCurrent ? (
                    <div className="current-stage-dot"></div>
                  ) : (
                    <div className="pending-stage-dot"></div>
                  )}
                </div>
                <span className="stage-label">{stage.label}</span>
              </div>
            );
          })}
        </div>

        {/* Rotating ATS Resume Tip */}
        <div className="pro-tip-box">
          <p>{PRO_TIPS[tipIndex]}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoader;
