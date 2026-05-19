const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadAndAnalyze, getRecentAnalyses } = require('../controllers/resumeController');

// POST /api/resume/upload
// Route to upload a PDF and get it analyzed
router.post('/upload', upload.single('resume'), uploadAndAnalyze);

// GET /api/resume/history
// Route to get previously analyzed resumes
router.get('/history', getRecentAnalyses);

module.exports = router;
