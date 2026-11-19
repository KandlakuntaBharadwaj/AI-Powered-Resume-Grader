import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Cpu,
  Target,
  BarChart3,
  Award,
  Layers,
  Search,
  FileText,
  ChevronDown,
  TrendingUp,
  Download,
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  const handlePrimaryCTA = () => {
    if (isAuthenticated) {
      navigate('/analyze');
    } else {
      navigate('/login?redirect=/analyze');
    }
  };

  const handleSecondaryCTA = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const faqs = [
    {
      q: 'What is an ATS and why does my resume need to be ATS-ready?',
      a: 'An Applicant Tracking System (ATS) is automated software used by 95%+ of Fortune 500 companies and tech organizations to filter, score, and rank job applicants before a human recruiter ever sees them. Unformatted columns, missing keywords, and poor bullet structures cause over 75% of resumes to be discarded automatically. ResumeGrader.AI ensures your resume passes automated filters directly into recruiter inboxes.',
    },
    {
      q: 'How does ResumeGrader.AI evaluate my resume?',
      a: 'Our engine extracts the full text from your PDF, maps it against industry benchmarks or your target job description, and evaluates six dimensions: overall ATS score, keyword coverage, content impact, writing quality, skill categorization, and structural parsing compatibility.',
    },
    {
      q: 'Will my uploaded resume and personal information be kept confidential?',
      a: 'Absolutely. We do not sell your personal data or share your documents with third-party recruiters. Your resume data is encrypted and tied strictly to your authenticated account.',
    },
    {
      q: 'Can I download my report to review offline?',
      a: 'Yes! Every analysis generates a downloadable, multi-page executive PDF report containing your ATS score, keyword metrics, section audits, and actionable improvement steps.',
    },
    {
      q: 'Does it cost anything to grade my resume?',
      a: 'You can create a free account and start analyzing resumes right away with full access to scoring, feedback, and PDF downloads.',
    },
  ];

  return (
    <div className="landing-page-root">
      {/* HERO SECTION */}
      <section className="hero-saas">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} className="text-indigo" />
              <span>Next-Gen AI Resume & ATS Intelligence</span>
            </div>

            <h1 className="hero-title">
              Make Your Resume <span className="gradient-text">ATS-Ready</span> with AI
            </h1>

            <p className="hero-description">
              Stop getting filtered out by recruiting bots. ResumeGrader.AI reverse-engineers Applicant Tracking Systems to pinpoint missing keywords, measure match rate against job descriptions, and deliver actionable fixes to double your interview callbacks.
            </p>

            <div className="hero-cta-group">
              <button className="btn-hero-primary" onClick={handlePrimaryCTA}>
                <span>Analyze My Resume</span>
                <ArrowRight size={18} />
              </button>

              <button className="btn-hero-secondary" onClick={handleSecondaryCTA}>
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}</span>
              </button>
            </div>

            <div className="hero-social-proof">
              <div className="proof-avatars">
                <span className="proof-dot green"></span>
                <span>Trusted by job seekers targeting Google, Meta, Amazon, and high-growth startups</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup Card */}
          <div className="hero-visual">
            <div className="mockup-card">
              <div className="mockup-top-bar">
                <div className="mockup-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="mockup-title">Resume_Senior_Engineer_2026.pdf</span>
              </div>

              <div className="mockup-body">
                <div className="mockup-score-banner">
                  <div className="mockup-score-circle">
                    <span className="score-val">87</span>
                    <span className="score-lbl">/100</span>
                  </div>
                  <div className="mockup-score-info">
                    <h4>ATS Score: Highly Optimized</h4>
                    <p className="status-sub">Top 12% Candidate Alignment • ATS Verified</p>
                  </div>
                </div>

                <div className="mockup-stats-grid">
                  <div className="m-stat">
                    <span className="m-label">Job Match</span>
                    <span className="m-val text-indigo">92%</span>
                  </div>
                  <div className="m-stat">
                    <span className="m-label">Keywords Found</span>
                    <span className="m-val text-success">18 Skills</span>
                  </div>
                  <div className="m-stat">
                    <span className="m-label">Missing Critical</span>
                    <span className="m-val text-danger">3 Gaps</span>
                  </div>
                </div>

                <div className="mockup-keyword-sample">
                  <span className="m-tag match">React.js</span>
                  <span className="m-tag match">Node.js</span>
                  <span className="m-tag match">System Architecture</span>
                  <span className="m-tag match">MongoDB</span>
                  <span className="m-tag miss">+ CI/CD Pipelines</span>
                  <span className="m-tag miss">+ Kubernetes</span>
                </div>

                <div className="mockup-pill-footer">
                  <CheckCircle2 size={15} className="text-success" />
                  <span>Executive PDF Report Ready for Download</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <section className="metrics-strip">
        <div className="strip-container">
          <div className="strip-stat">
            <h3>98.4%</h3>
            <p>ATS Algorithm Accuracy</p>
          </div>
          <div className="strip-stat">
            <h3>3.2x</h3>
            <p>Average Increase in Callbacks</p>
          </div>
          <div className="strip-stat">
            <h3>&lt; 90s</h3>
            <p>Full AI Multi-Section Audit</p>
          </div>
          <div className="strip-stat">
            <h3>100%</h3>
            <p>Confidential & Secure Processing</p>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-pill">Powerful Features</span>
            <h2>Everything You Need to Beat the Resume Screen</h2>
            <p>Modern platforms like Cake Resume focus on design; we give you the deep, data-driven AI intelligence that guarantees algorithmic visibility.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box bg-indigo">
                <Target size={22} className="text-indigo" />
              </div>
              <h3>Dynamic ATS Scoring</h3>
              <p>Authentic, calibrated grading from 0 to 100 based on exact keyword density, measurable achievements, and parsing structure.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box bg-emerald">
                <Search size={22} className="text-emerald" />
              </div>
              <h3>Job Description Matching</h3>
              <p>Paste any job description to instantly uncover missing technical skills, soft skills, and keyword terminology required for that role.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box bg-sky">
                <BarChart3 size={22} className="text-sky" />
              </div>
              <h3>Interactive Data Visualizations</h3>
              <p>Clean charts illustrating keyword coverage, section performance ratings, and ATS compatibility across key evaluation pillars.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box bg-amber">
                <FileCheck2 size={22} className="text-amber" />
              </div>
              <h3>Section-by-Section Audit</h3>
              <p>In-depth evaluations for Contact Info, Professional Summary, Work Experience, Projects, Education, and Certifications.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box bg-rose">
                <Cpu size={22} className="text-rose" />
              </div>
              <h3>Writing Style & Action Verbs</h3>
              <p>Critique of sentence economy, grammatical flow, professional tone, and recommendation of high-impact leadership action verbs.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box bg-purple">
                <Download size={22} className="text-purple" />
              </div>
              <h3>Multi-Page PDF Reports</h3>
              <p>Export a polished, executive-level PDF audit report with full breakdown, metrics, and actionable checklists to review anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <span className="section-pill">Simple 3-Step Process</span>
            <h2>How It Works</h2>
            <p>From PDF upload to interview-ready resume in under two minutes.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <div className="step-icon-wrap">
                <FileText size={26} className="text-indigo" />
              </div>
              <h3>Upload Your Resume</h3>
              <p>Drag and drop your PDF resume and optionally paste your target job description for customized role matching.</p>
            </div>

            <div className="step-card">
              <div className="step-num">02</div>
              <div className="step-icon-wrap">
                <Cpu size={26} className="text-emerald" />
              </div>
              <h3>Deep AI Multi-Stage Scan</h3>
              <p>Watch our transparent 8-stage AI engine validate, parse, extract skills, and run algorithmic ATS compatibility checks.</p>
            </div>

            <div className="step-card">
              <div className="step-num">03</div>
              <div className="step-icon-wrap">
                <Award size={26} className="text-amber" />
              </div>
              <h3>Get Report & Download PDF</h3>
              <p>Review comprehensive feedback across content, style, skills, and sections. Export your branded PDF report with one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="benefits-section" id="benefits">
        <div className="section-container">
          <div className="benefits-card-layout">
            <div className="benefits-text-col">
              <span className="section-pill">Why AI Grading Matters</span>
              <h2>Eliminate Blind Spots Before Recruiters Find Them</h2>
              <p>
                Sending unoptimized resumes into company job portals is like gambling with your career. ResumeGrader.AI gives you the exact blueprint to pass every gatekeeper.
              </p>

              <div className="benefit-bullets">
                <div className="benefit-item">
                  <div className="b-icon"><CheckCircle2 size={18} className="text-success" /></div>
                  <div>
                    <h4>Stop automated ATS rejections</h4>
                    <p>Format and keyword alignment ensures your file parses cleanly without corrupting dates, roles, or skills.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="b-icon"><CheckCircle2 size={18} className="text-success" /></div>
                  <div>
                    <h4>Quantify your professional impact</h4>
                    <p>Identify weak bullets and replace them with metric-driven, result-oriented statements recruiters respect.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="b-icon"><CheckCircle2 size={18} className="text-success" /></div>
                  <div>
                    <h4>Tailor every application in seconds</h4>
                    <p>Paste the job posting to see exactly which high-frequency keywords you are missing before you click apply.</p>
                  </div>
                </div>
              </div>

              <div className="benefits-cta">
                <button className="btn-primary" onClick={handlePrimaryCTA}>
                  <span>Analyze Your Resume Now</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="benefits-visual-col">
              <div className="comparison-card">
                <div className="comp-header">
                  <h4>Before vs. After Optimization</h4>
                </div>
                <div className="comp-rows">
                  <div className="comp-row bad">
                    <span className="comp-tag danger">Before</span>
                    <p className="comp-text">"Responsible for building web applications and fixing bugs for client projects."</p>
                    <span className="comp-feedback text-danger">Generic, passive, no metrics</span>
                  </div>
                  <div className="comp-row good">
                    <span className="comp-tag success">After AI Fix</span>
                    <p className="comp-text">"Spearheaded development of 3 React/Node.js web applications, reducing API response latency by 35% across 200,000+ active users."</p>
                    <span className="comp-feedback text-success">Action verb, quantifiable metrics, high ATS impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section" id="faq">
        <div className="section-container">
          <div className="section-header">
            <span className="section-pill">Got Questions?</span>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about ResumeGrader.AI and ATS optimization.</p>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`faq-item ${openFaq === idx ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="faq-question">
                  <h3>{faq.q}</h3>
                  <ChevronDown size={18} className="faq-arrow" />
                </div>
                {openFaq === idx && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL BOTTOM CALL-TO-ACTION */}
      <section className="cta-banner-section">
        <div className="cta-banner-container">
          <div className="cta-banner-content">
            <h2>Ready to Land More Interviews?</h2>
            <p>Get a comprehensive ATS analysis of your resume in less than two minutes. No credit card required.</p>
            <div className="cta-banner-buttons">
              <button className="btn-banner-primary" onClick={handlePrimaryCTA}>
                <span>Analyze My Resume</span>
                <ArrowRight size={17} />
              </button>
              {!isAuthenticated && (
                <button className="btn-banner-secondary" onClick={() => navigate('/register')}>
                  <span>Create Free Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
