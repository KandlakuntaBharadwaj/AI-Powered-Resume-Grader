const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const {
  uploadAndAnalyze,
  getRecentAnalyses,
  getResumeById,
  deleteResume,
  getDashboardStats,
} = require('../controllers/resumeController');
const { protect } = require('../middlewares/authMiddleware');

// POST /api/resume/upload - Upload a PDF and get it analyzed
router.post('/upload', protect, upload.single('resume'), uploadAndAnalyze);

// GET /api/resume/history - Get all previously analyzed resumes
router.get('/history', protect, getRecentAnalyses);

// GET /api/resume/stats - Get aggregated dashboard statistics
router.get('/stats', protect, getDashboardStats);

// GET /api/resume/:id - Get specific resume analysis details
router.get('/:id', protect, getResumeById);

// DELETE /api/resume/:id - Delete a resume analysis
router.delete('/:id', protect, deleteResume);

module.exports = router;
