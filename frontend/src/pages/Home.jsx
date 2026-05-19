import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { uploadResume } from '../apis/api';

const Home = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await uploadResume(file, jobDescription);
      if (response.success) {
        // Navigate to dashboard and pass the analysis data in state
        navigate('/dashboard', { state: { analysis: response.data } });
      } else {
        setError(response.message || 'Analysis failed.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>AI-Powered Resume Grader</h1>
        <p>Optimize your resume for Applicant Tracking Systems (ATS) instantly. Upload your PDF and get actionable feedback.</p>
      </div>

      <div className="upload-card">
        <FileUpload file={file} setFile={setFile} />
        
        <div className="job-desc-section">
          <label htmlFor="jobDesc">Job Description (Optional)</label>
          <textarea 
            id="jobDesc" 
            placeholder="Paste the job description here for tailored feedback..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
          ></textarea>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          className="btn-primary" 
          onClick={handleAnalyze} 
          disabled={loading || !file}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <h2>Analyzing your resume with AI...</h2>
          <p>This might take a few seconds as we extract your data.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
