const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema(
  {
    originalFilename: {
      type: String,
      required: true,
    },
    parsedText: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    keywordsExtracted: {
      type: [String],
      required: true,
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // optional to keep compatibility with existing records
    },
    jobDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
