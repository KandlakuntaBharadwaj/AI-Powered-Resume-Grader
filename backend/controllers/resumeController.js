const fs = require('fs');
const { extractTextFromPDF } = require('../services/pdfService');
const { analyzeResume } = require('../services/aiService');
const Resume = require('../models/Resume');

// @desc    Upload and analyze resume
// @route   POST /api/resume/upload
// @access  Private
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
    if (!parsedText || parsedText.trim().length === 0) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from the PDF. Please ensure the PDF is not an image scan or password-protected.',
      });
    }

    // 2. Send text to AI for analysis
    const aiAnalysis = await analyzeResume(parsedText, jobDescription);

    // 3. Save results to database
    let savedResume = null;
    try {
      savedResume = await Resume.create({
        originalFilename: req.file.originalname,
        parsedText,
        score: aiAnalysis.score,
        matchPercentage: aiAnalysis.matchPercentage,
        summary: aiAnalysis.summary,
        keywordsExtracted: aiAnalysis.keywordsExtracted,
        missingKeywords: aiAnalysis.missingKeywords,
        suggestions: aiAnalysis.suggestions,
        overview: aiAnalysis.overview,
        contentAnalysis: aiAnalysis.contentAnalysis,
        styleAnalysis: aiAnalysis.styleAnalysis,
        skillsAnalysis: aiAnalysis.skillsAnalysis,
        formatAnalysis: aiAnalysis.formatAnalysis,
        sectionFeedback: aiAnalysis.sectionFeedback,
        user: req.user ? req.user.id : null,
        jobDescription: jobDescription || '',
      });
    } catch (dbError) {
      console.warn('Could not save to database, continuing without saving:', dbError.message);
    }

    // 4. Clean up uploaded temporary file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 5. Send response to frontend
    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: {
        id: savedResume ? savedResume._id : null,
        _id: savedResume ? savedResume._id : null,
        createdAt: savedResume ? savedResume.createdAt : new Date(),
        originalFilename: req.file.originalname,
        jobDescription: jobDescription || '',
        ...aiAnalysis,
      },
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload Controller Error:', error);
    res.status(500).json({ success: false, message: error.message || 'An error occurred during resume analysis.' });
  }
};

// @desc    Get all analyses for the logged-in user
// @route   GET /api/resume/history
// @access  Private
const getRecentAnalyses = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .select('-parsedText')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    console.error('History Error:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching analysis history.' });
  }
};

// @desc    Get specific analysis report by ID
// @route   GET /api/resume/:id
// @access  Private
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume analysis not found or unauthorized.' });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error('Get Resume Error:', error);
    res.status(500).json({ success: false, message: 'Server Error retrieving resume report.' });
  }
};

// @desc    Delete analysis report by ID
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume analysis not found or unauthorized.' });
    }

    res.status(200).json({
      success: true,
      message: 'Resume analysis deleted successfully.',
    });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    res.status(500).json({ success: false, message: 'Server Error deleting resume analysis.' });
  }
};

// @desc    Get dashboard statistics for logged-in user
// @route   GET /api/resume/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumes = await Resume.find({ user: userId })
      .select('score matchPercentage originalFilename createdAt jobDescription')
      .sort({ createdAt: -1 });

    const totalAnalyses = resumes.length;

    let averageScore = 0;
    let highestScore = 0;
    let latestScore = 0;

    if (totalAnalyses > 0) {
      latestScore = resumes[0].score;
      const sum = resumes.reduce((acc, curr) => acc + (curr.score || 0), 0);
      averageScore = Math.round(sum / totalAnalyses);
      highestScore = Math.max(...resumes.map(r => r.score || 0));
    }

    res.status(200).json({
      success: true,
      data: {
        totalAnalyses,
        latestScore,
        averageScore,
        highestScore,
        recentAnalyses: resumes.slice(0, 5),
      },
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching dashboard stats.' });
  }
};

module.exports = {
  uploadAndAnalyze,
  getRecentAnalyses,
  getResumeById,
  deleteResume,
  getDashboardStats,
};
