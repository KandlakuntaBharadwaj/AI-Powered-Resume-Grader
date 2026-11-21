import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import AnalysisLoader from '../components/AnalysisLoader';
import AtsCompetitivenessReference from '../components/AtsCompetitivenessReference';
import { uploadResume } from '../apis/api';
import { Sparkles, FileText, AlertCircle, ArrowLeft, HelpCircle, Info } from 'lucide-react';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();

    if (!file) {
      setValidationError('Please select or upload a PDF resume before proceeding.');
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setValidationError('Only PDF files are supported. Please upload a valid PDF document.');
      return;
    }

    // Clear previous errors & lock state
    setValidationError('');
    setAnalysisError('');
    setIsAnalyzing(true);
    setUploadProgress(0);
    setIsFinished(false);

    try {
      const response = await uploadResume(file, jobDescription, (percent) => {
        setUploadProgress(percent);
      });

      if (response.success && response.data) {
        setIsFinished(true);
        // Short natural delay for user to see the 100% completion checkmark
        setTimeout(() => {
          navigate('/results', {
            state: {
              analysis: response.data,
              fromAnalysis: true,
            },
          });
        }, 1200);
      } else {
        setAnalysisError(response.message || 'Analysis could not be completed. Please try again.');
      }
    } catch (err) {
      console.error('Analysis submission error:', err);
      const message = err.message || (typeof err === 'string' ? err : 'Server communication failure during analysis.');
      setAnalysisError(message);
    } finally {
      // If error occurred, allow retrying by resetting isAnalyzing
      // If succeeded, navigation will take care of transition
    }
  };

  const handleRetry = () => {
    setAnalysisError('');
    setIsAnalyzing(false);
    setIsFinished(false);
  };

  return (
    <div className="analyzer-page-container">
      {/* Top Banner / Heading */}
      <div className="analyzer-header">
        <div className="analyzer-badge">
          <Sparkles size={14} className="text-indigo" />
          <span>Interactive ATS Engine</span>
        </div>
        <h1>Resume Analysis Workspace</h1>
        <p className="analyzer-subtitle">
          Upload your resume and optionally include your target job posting for custom keyword gap analysis and ATS optimization.
        </p>
      </div>

      {/* Main Workspace Card */}
      {isAnalyzing || analysisError ? (
        <AnalysisLoader
          isAnalyzing={isAnalyzing}
          uploadProgress={uploadProgress}
          isFinished={isFinished}
          error={analysisError}
          onRetry={handleRetry}
        />
      ) : (
        <>
          <div className="analyzer-card">
            <form onSubmit={handleAnalyze} className="analyzer-form">
            {/* Step 1: File Upload */}
            <div className="form-section">
              <div className="section-label-row">
                <span className="step-tag">Step 1</span>
                <h3>Upload Your PDF Resume</h3>
                <span className="required-tag">Required</span>
              </div>
              <p className="section-desc">
                Make sure your PDF is text-selectable (not an image scan) for accurate keyword and section parsing.
              </p>

              <FileUpload
                file={file}
                setFile={setFile}
                validationError={validationError}
                setValidationError={setValidationError}
              />
            </div>

            {/* Step 2: Job Description */}
            <div className="form-section">
              <div className="section-label-row">
                <span className="step-tag">Step 2</span>
                <h3>Target Job Description</h3>
                <span className="optional-tag">Recommended</span>
              </div>
              <p className="section-desc">
                Paste the full job posting text (responsibilities, qualifications, and requirements) to analyze keyword match rate.
              </p>

              {/* Pro Tip Callout */}
              <div className="pro-tip-box">
                <Info size={15} className="pro-tip-icon" />
                <span className="pro-tip-text">
                  <strong>Pro Tip:</strong> Add a target job description for a more accurate ATS score.
                </span>
              </div>

              <div className="job-desc-wrapper">
                <textarea
                  id="jobDescriptionInput"
                  rows={6}
                  placeholder="e.g. Senior Software Engineer at Stripe: Responsibilities include designing distributed systems, leading React/Node microservices, optimizing PostgreSQL queries, and mentoring engineers..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="job-desc-textarea"
                ></textarea>

                <div className="textarea-footer">
                  <div className="char-count">
                    <span>{jobDescription.length} characters</span>
                    {jobDescription.length > 0 && jobDescription.length < 50 && (
                      <span className="char-hint warning">For best results, include full requirements.</span>
                    )}
                  </div>
                  {jobDescription.length > 0 && (
                    <button
                      type="button"
                      className="btn-clear-desc"
                      onClick={() => setJobDescription('')}
                    >
                      Clear text
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Submission & Error Alerts */}
            {validationError && (
              <div className="form-alert-box error">
                <AlertCircle size={16} />
                <span>{validationError}</span>
              </div>
            )}

            <div className="analyzer-submit-row">
              <button
                type="submit"
                className="btn-primary btn-analyze-large"
                disabled={!file || isAnalyzing}
              >
                <Sparkles size={18} />
                <span>Analyze Resume with AI</span>
              </button>
              <p className="submit-hint">
                By clicking analyze, your resume is securely parsed and evaluated in ~1–2 minutes.
              </p>
            </div>
          </form>
        </div>

        {/* ATS Competitiveness Reference Guide */}
        <AtsCompetitivenessReference
          title="ATS Competitiveness Benchmark"
          subtitle="Score calibration used during evaluation"
          compact={true}
        />
      </>
    )}
  </div>
  );
};

export default ResumeAnalyzer;
