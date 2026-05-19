import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

const FileUpload = ({ file, setFile }) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        alert('Please upload a valid PDF file.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type !== 'application/pdf') {
        alert('Please upload a valid PDF file.');
        return;
      }
      setFile(droppedFile);
    }
  }, [setFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <div 
      className="upload-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input 
        type="file" 
        id="fileInput" 
        accept=".pdf" 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />
      <label htmlFor="fileInput" className="upload-label">
        <UploadCloud className="upload-icon" size={48} />
        {file ? (
          <div className="file-selected">
            <span className="file-name">{file.name}</span>
            <span className="change-file">Click to change file</span>
          </div>
        ) : (
          <div>
            <h3>Drag & Drop your resume here</h3>
            <p>or click to browse (PDF only)</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default FileUpload;
