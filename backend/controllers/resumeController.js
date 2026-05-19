const fs = require('fs');
const { extractTextFromPDF } = require('../services/pdfService');
const { analyzeResume } = require('../services/aiService');
const Resume = require('../models/Resume');

const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF resume.' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ success: false, message: 'Only PDF files are allowed.' });
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit.' });
    }

    const { jobDescription } = req.body;
    const filePath = req.file.path;

    // 1. Extract text from PDF
    const parsedText = await extractTextFromPDF(filePath);

    // 2. Send text to AI for analysis
    const aiAnalysis = await analyzeResume(parsedText, jobDescription);

    // 3. Save results to database (Optional, wrap in try-catch to not fail the whole request if DB is down)
    let savedResume = null;
    try {
      savedResume = await Resume.create({
        originalFilename: req.file.originalname,
        parsedText,
        score: aiAnalysis.score,
        keywordsExtracted: aiAnalysis.keywordsExtracted,
        missingKeywords: aiAnalysis.missingKeywords,
        suggestions: aiAnalysis.suggestions,
      });
    } catch (dbError) {
      console.warn('Could not save to database, continuing without saving.', dbError.message);
    }

    // 4. Clean up uploaded file
    fs.unlinkSync(filePath);

    // 5. Send response to frontend
    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: {
        id: savedResume ? savedResume._id : null,
        ...aiAnalysis,
      },
    });

  } catch (error) {
    // Ensure we clean up the file even if there is an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload Controller Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecentAnalyses = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  uploadAndAnalyze,
  getRecentAnalyses,
};
