import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-saas">
      <div className="footer-top-container">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <div className="logo-icon-bg sm">
              <FileCheck2 size={18} className="logo-icon" />
            </div>
            <span className="logo-text">
              ResumeGrader<span className="logo-accent">.AI</span>
            </span>
          </div>
          <p className="footer-tagline">
            Next-generation AI resume grading and ATS optimization platform. Designed to help professionals land top-tier tech and corporate interviews.
          </p>
          <div className="system-status-pill">
            <span className="status-ping"></span>
            <ShieldCheck size={14} className="text-success" />
            <span>AI Inference Engine Operational</span>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link to="/analyze">Resume Analyzer</Link></li>
              <li><a href="#features">ATS Audit System</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#benefits">Scoring Methodology</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>ATS Resources</h4>
            <ul>
              <li><a href="#features">Keyword Gap Analysis</a></li>
              <li><a href="#features">Action Verb Library</a></li>
              <li><a href="#faq">ATS Parsing Guidelines</a></li>
              <li><a href="#faq">Common ATS Pitfalls</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Free Account</Link></li>
              <li><Link to="/history">Analysis Archive</Link></li>
              <li><Link to="/profile">Profile Settings</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} ResumeGrader.AI. All rights reserved.
          </p>
          <p className="built-with">
            Built for modern career advancement with advanced AI analysis.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
