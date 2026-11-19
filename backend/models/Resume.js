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
    matchPercentage: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      default: '',
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
    overview: {
      strengthsCount: { type: Number, default: 0 },
      criticalIssuesCount: { type: Number, default: 0 },
      matchingKeywordsCount: { type: Number, default: 0 },
      missingKeywordsCount: { type: Number, default: 0 },
      keyTakeaway: { type: String, default: '' },
    },
    contentAnalysis: {
      summaryEvaluation: {
        score: { type: Number, default: 0 },
        feedback: { type: String, default: '' },
      },
      workExperienceEvaluation: {
        score: { type: Number, default: 0 },
        feedback: { type: String, default: '' },
      },
      educationEvaluation: {
        score: { type: Number, default: 0 },
        feedback: { type: String, default: '' },
      },
      projectsEvaluation: {
        score: { type: Number, default: 0 },
        feedback: { type: String, default: '' },
      },
      achievementsEvaluation: {
        score: { type: Number, default: 0 },
        feedback: { type: String, default: '' },
      },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
    },
    styleAnalysis: {
      writingQuality: { type: String, default: '' },
      clarityAndReadability: { type: String, default: '' },
      grammarAndLanguage: { type: String, default: '' },
      actionVerbUsage: {
        score: { type: Number, default: 0 },
        feedback: { type: String, default: '' },
        examplesFound: { type: [String], default: [] },
        recommendations: { type: [String], default: [] },
      },
      sentenceQuality: { type: String, default: '' },
      tone: { type: String, default: '' },
    },
    skillsAnalysis: {
      matchingTechnicalSkills: { type: [String], default: [] },
      missingTechnicalSkills: { type: [String], default: [] },
      matchingSoftSkills: { type: [String], default: [] },
      missingSoftSkills: { type: [String], default: [] },
      recommendedSkills: { type: [String], default: [] },
    },
    formatAnalysis: {
      resumeStructure: { type: String, default: '' },
      sectionOrganization: { type: String, default: '' },
      headingConsistency: { type: String, default: '' },
      formattingConsistency: { type: String, default: '' },
      readabilityScore: { type: Number, default: 0 },
      atsCompatibilityRating: { type: String, default: 'Standard' },
      potentialFormattingIssues: { type: [String], default: [] },
    },
    sectionFeedback: [
      {
        section: { type: String, required: true },
        status: { type: String, enum: ['good', 'needs-improvement', 'missing', 'acceptable'], default: 'acceptable' },
        currentAssessment: { type: String, default: '' },
        identifiedIssues: { type: [String], default: [] },
        actionableRecommendations: { type: [String], default: [] },
        suggestedImprovements: { type: String, default: '' },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
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
