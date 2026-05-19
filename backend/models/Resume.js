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
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
