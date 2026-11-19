import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, FileText, CheckCircle, Trash2, RefreshCw, AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const FileUpload = ({ file, setFile, validationError, setValidationError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      if (setValidationError) setValidationError('Invalid file format. Please upload a standard PDF resume.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      if (setValidationError) setValidationError('File size exceeds the 5MB limit. Please upload a smaller PDF file.');
      return;
    }

    if (setValidationError) setValidationError('');
    setFile(selectedFile);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, [setFile, setValidationError]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    if (setValidationError) setValidationError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReplace = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="file-upload-component">
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="resume-file-input"
      />

      {!file ? (
        <div
          className={`dropzone-container ${isDragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <div className="dropzone-inner">
            <div className="upload-icon-circle">
              <UploadCloud size={32} className="text-indigo" />
            </div>
            <h3>Drag & Drop your resume here</h3>
            <p className="dropzone-subtitle">Supports PDF files up to 5MB</p>
            <button
              type="button"
              className="btn-browse"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </button>
          </div>
        </div>
      ) : (
        <div className="file-preview-card">
          <div className="file-info-left">
            <div className="pdf-icon-badge">
              <FileText size={28} className="text-indigo" />
              <span className="file-ext">PDF</span>
            </div>
            <div className="file-text-details">
              <h4 className="file-name" title={file.name}>
                {file.name}
              </h4>
              <div className="file-subdetails">
                <span className="file-size">{formatFileSize(file.size)}</span>
                <span className="bullet-sep">•</span>
                <span className="file-status text-success">
                  <CheckCircle size={13} /> Ready for analysis
                </span>
              </div>
            </div>
          </div>

          <div className="file-actions-right">
            <button
              type="button"
              className="btn-file-action replace"
              onClick={handleReplace}
              title="Replace resume file"
            >
              <RefreshCw size={14} />
              <span>Replace</span>
            </button>
            <button
              type="button"
              className="btn-file-action remove"
              onClick={handleRemove}
              title="Remove resume"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {validationError && (
        <div className="upload-validation-alert">
          <AlertCircle size={16} />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
