const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadAndAnalyze, getRecentAnalyses } = require('../controllers/resumeController');
const { protect } = require('../middlewares/authMiddleware');

// POST /api/resume/upload
// Route to upload a PDF and get it analyzed
router.post('/upload', protect, upload.single('resume'), uploadAndAnalyze);

// GET /api/resume/history
// Route to get previously analyzed resumes
router.get('/history', protect, getRecentAnalyses);

module.exports = router;
