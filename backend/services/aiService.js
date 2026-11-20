const { HfInference } = require('@huggingface/inference');
const { processDomainKeywords, detectDomains } = require('./keywordService');
const { DOMAINS } = require('../data/keywordDatabase');

/**
 * Normalizes and ensures all expected fields are present in the AI analysis output.
 */
const normalizeAnalysisOutput = (raw, resumeText, jobDescription) => {
  const score = typeof raw.score === 'number' && !isNaN(raw.score)
    ? Math.max(0, Math.min(100, Math.round(raw.score)))
    : 65;

  const matchPercentage = typeof raw.matchPercentage === 'number' && !isNaN(raw.matchPercentage)
    ? Math.max(0, Math.min(100, Math.round(raw.matchPercentage)))
    : (jobDescription ? Math.max(20, Math.min(100, Math.round(score * 0.98))) : score);

  // Apply comprehensive domain-aware keyword extraction, branch boundaries & equivalency deduplication
  const processedKws = processDomainKeywords(
    resumeText,
    jobDescription,
    raw.keywordsExtracted || [],
    raw.missingKeywords || []
  );

  const keywordsExtracted = processedKws.keywordsExtracted;
  const missingKeywords = processedKws.missingKeywords;

  // Default suggestions to ensure exactly 6 comprehensive actionable fixes
  const defaultSuggestions = [
    'Integrate high-frequency missing technical keywords directly into your professional summary and work experience bullet points to satisfy initial ATS keyword filters.',
    'Replace passive duty descriptions with dynamic leadership action verbs (e.g. Spearheaded, Engineered, Orchestrated, Optimized) at the start of every experience bullet point.',
    'Quantify professional accomplishments using the STAR framework with concrete business metrics (percentages, dollar amounts, throughput, user scale, latency reductions).',
    'Structure experience in strict reverse-chronological order and ensure standard ATS heading naming conventions (Professional Summary, Work Experience, Skills, Education).',
    'Eliminate multi-column layouts, graphical skill bars, tables, or text boxes that cause automated ATS parsers to skip or scramble candidate information.',
    'Tailor your core competencies and project highlights specifically to match the required tools, frameworks, and qualifications outlined in the target job description.'
  ];

  let rawSuggestions = Array.isArray(raw.suggestions) && raw.suggestions.length > 0 ? raw.suggestions : [];
  // Ensure we have exactly 6 distinct, high-impact suggestions
  const mergedSuggestions = [...rawSuggestions];
  for (const defSug of defaultSuggestions) {
    if (mergedSuggestions.length >= 6) break;
    if (!mergedSuggestions.some(s => s.toLowerCase().includes(defSug.substring(0, 20).toLowerCase()))) {
      mergedSuggestions.push(defSug);
    }
  }
  const suggestions = mergedSuggestions.slice(0, 6);

  const summary = raw.summary || (raw.overview && raw.overview.keyTakeaway) ||
    'Resume evaluation completed against modern ATS standards and competitive industry benchmarks.';

  const overview = {
    strengthsCount: raw.overview?.strengthsCount ?? (raw.contentAnalysis?.strengths?.length || 3),
    criticalIssuesCount: raw.overview?.criticalIssuesCount ?? (raw.contentAnalysis?.weaknesses?.length || 2),
    matchingKeywordsCount: raw.overview?.matchingKeywordsCount ?? keywordsExtracted.length,
    missingKeywordsCount: raw.overview?.missingKeywordsCount ?? missingKeywords.length,
    keyTakeaway: raw.overview?.keyTakeaway || summary,
  };

  const contentAnalysis = {
    summaryEvaluation: {
      score: typeof raw.contentAnalysis?.summaryEvaluation?.score === 'number'
        ? Math.max(0, Math.min(100, Math.round(raw.contentAnalysis.summaryEvaluation.score)))
        : Math.max(25, Math.min(98, score + 2)),
      feedback: raw.contentAnalysis?.summaryEvaluation?.feedback ||
        'The professional summary establishes candidate background, but can be elevated by highlighting top quantifiable career wins and specific technical specializations in the first sentence.',
    },
    workExperienceEvaluation: {
      score: typeof raw.contentAnalysis?.workExperienceEvaluation?.score === 'number'
        ? Math.max(0, Math.min(100, Math.round(raw.contentAnalysis.workExperienceEvaluation.score)))
        : Math.max(25, Math.min(98, score - 2)),
      feedback: raw.contentAnalysis?.workExperienceEvaluation?.feedback ||
        'Work experience demonstrates progressive career responsibility. Incorporating more explicit business context, team scope, and operational impact will maximize recruiter resonance.',
    },
    educationEvaluation: {
      score: typeof raw.contentAnalysis?.educationEvaluation?.score === 'number'
        ? Math.max(0, Math.min(100, Math.round(raw.contentAnalysis.educationEvaluation.score)))
        : Math.max(30, Math.min(100, score + 5)),
      feedback: raw.contentAnalysis?.educationEvaluation?.feedback ||
        'Educational background is clearly documented with institution, degree, and graduation timeline adhering to standard ATS parsing hierarchies.',
    },
    projectsEvaluation: {
      score: typeof raw.contentAnalysis?.projectsEvaluation?.score === 'number'
        ? Math.max(0, Math.min(100, Math.round(raw.contentAnalysis.projectsEvaluation.score)))
        : Math.max(25, Math.min(98, score)),
      feedback: raw.contentAnalysis?.projectsEvaluation?.feedback ||
        'Project descriptions reflect applied technical proficiency. Highlight architectural challenges, tool integrations, and real-world deployment outcomes.',
    },
    achievementsEvaluation: {
      score: typeof raw.contentAnalysis?.achievementsEvaluation?.score === 'number'
        ? Math.max(0, Math.min(100, Math.round(raw.contentAnalysis.achievementsEvaluation.score)))
        : Math.max(20, Math.min(95, score - 5)),
      feedback: raw.contentAnalysis?.achievementsEvaluation?.feedback ||
        'Achievements could feature more measurable metrics (e.g. percentage improvements, cost reductions, revenue impact, or user scale) to substantiate claims.',
    },
    strengths: Array.isArray(raw.contentAnalysis?.strengths) && raw.contentAnalysis.strengths.length > 0
      ? raw.contentAnalysis.strengths
      : [
        'Clear progression of technical roles and responsibilities across employment history',
        'Good representation of modern programming languages and industry-standard frameworks',
        'Concise bullet structure that avoids excessive paragraph blocks',
        'Chronological employment trajectory that parses cleanly across automated ATS filters'
      ],
    weaknesses: Array.isArray(raw.contentAnalysis?.weaknesses) && raw.contentAnalysis.weaknesses.length > 0
      ? raw.contentAnalysis.weaknesses
      : [
        'Limited quantifiable business metrics and scale numbers in earlier job positions',
        'Some critical keywords from the target role are not explicitly mentioned in experience bullets',
        'Action verbs could be diversified to show greater leadership and system ownership'
      ],
  };

  const styleAnalysis = {
    writingQuality: raw.styleAnalysis?.writingQuality ||
      'Professional, direct, and concise with conventional industry terminology and minimal filler phrasing.',
    clarityAndReadability: raw.styleAnalysis?.clarityAndReadability ||
      'High visual scanability with well-defined bulleted lists that enable human recruiters to quickly triage key qualifications within 6 seconds.',
    grammarAndLanguage: raw.styleAnalysis?.grammarAndLanguage ||
      'Consistent grammatical structure with appropriate past-tense usage for prior roles and present-tense for current responsibilities.',
    actionVerbUsage: {
      score: typeof raw.styleAnalysis?.actionVerbUsage?.score === 'number'
        ? Math.max(0, Math.min(100, Math.round(raw.styleAnalysis.actionVerbUsage.score)))
        : Math.max(25, Math.min(95, score)),
      feedback: raw.styleAnalysis?.actionVerbUsage?.feedback ||
        'Solid use of action verbs leading bullet points. Elevate impact by replacing passive verbs (worked on, helped) with decisive leadership verbs.',
      examplesFound: Array.isArray(raw.styleAnalysis?.actionVerbUsage?.examplesFound) && raw.styleAnalysis.actionVerbUsage.examplesFound.length > 0
        ? raw.styleAnalysis.actionVerbUsage.examplesFound
        : ['Developed', 'Implemented', 'Architected', 'Managed', 'Engineered'],
      recommendations: Array.isArray(raw.styleAnalysis?.actionVerbUsage?.recommendations) && raw.styleAnalysis.actionVerbUsage.recommendations.length > 0
        ? raw.styleAnalysis.actionVerbUsage.recommendations
        : ['Spearheaded', 'Optimized', 'Orchestrated', 'Scaled', 'Pioneered', 'Automated'],
    },
    sentenceQuality: raw.styleAnalysis?.sentenceQuality ||
      'Sentences are focused, well-delimited, and avoid run-on phrasing, maintaining strong professional momentum.',
    tone: raw.styleAnalysis?.tone ||
      'Formal, objective, and executive tone avoiding casual expressions or self-referential pronouns (I, me, my).',
  };

  const skillsAnalysis = {
    matchingTechnicalSkills: processedKws.skillsAnalysis?.matchingTechnicalSkills?.length > 0
      ? processedKws.skillsAnalysis.matchingTechnicalSkills
      : (Array.isArray(raw.skillsAnalysis?.matchingTechnicalSkills) && raw.skillsAnalysis.matchingTechnicalSkills.length > 0
          ? raw.skillsAnalysis.matchingTechnicalSkills
          : keywordsExtracted.slice(0, 10)),
    missingTechnicalSkills: processedKws.skillsAnalysis?.missingTechnicalSkills?.length > 0
      ? processedKws.skillsAnalysis.missingTechnicalSkills
      : (Array.isArray(raw.skillsAnalysis?.missingTechnicalSkills) && raw.skillsAnalysis.missingTechnicalSkills.length > 0
          ? raw.skillsAnalysis.missingTechnicalSkills
          : missingKeywords.slice(0, 6)),
    matchingSoftSkills: processedKws.skillsAnalysis?.matchingSoftSkills?.length > 0
      ? processedKws.skillsAnalysis.matchingSoftSkills
      : ['Cross-functional Collaboration', 'Technical Problem Solving', 'Agile Delivery', 'Communication'],
    missingSoftSkills: processedKws.skillsAnalysis?.missingSoftSkills?.length > 0
      ? processedKws.skillsAnalysis.missingSoftSkills
      : ['System Ownership', 'Stakeholder Alignment', 'Engineering Mentorship'],
    recommendedSkills: processedKws.skillsAnalysis?.recommendedSkills?.length > 0
      ? processedKws.skillsAnalysis.recommendedSkills
      : (missingKeywords.length > 0 ? missingKeywords.slice(0, 5) : ['System Architecture', 'CI/CD Pipelines', 'Cloud Optimization']),
  };

  const formatAnalysis = {
    resumeStructure: raw.formatAnalysis?.resumeStructure ||
      'Single-column reverse-chronological layout optimal for ATS parsing engines and recruiter screeners.',
    sectionOrganization: raw.formatAnalysis?.sectionOrganization ||
      'Sections follow standard hierarchy (Contact Info → Summary → Skills → Experience → Education → Projects).',
    headingConsistency: raw.formatAnalysis?.headingConsistency ||
      'Uniform casing, font hierarchy, and header styling recognized by major parsing engines (Workday, Greenhouse, Taleo).',
    formattingConsistency: raw.formatAnalysis?.formattingConsistency ||
      'Consistent date formats, margin alignments, and standard round bullet points without unparsable glyphs.',
    readabilityScore: raw.formatAnalysis?.readabilityScore ?? Math.min(100, score + 6),
    atsCompatibilityRating: raw.formatAnalysis?.atsCompatibilityRating || (score >= 80 ? 'High' : score >= 60 ? 'Moderate' : 'Low'),
    potentialFormattingIssues: Array.isArray(raw.formatAnalysis?.potentialFormattingIssues)
      ? raw.formatAnalysis.potentialFormattingIssues
      : [],
  };

  const defaultSections = [
    'Contact Information',
    'Professional Summary',
    'Skills',
    'Work Experience',
    'Projects',
    'Education',
    'Certifications'
  ];

  let sectionFeedback = [];
  if (Array.isArray(raw.sectionFeedback) && raw.sectionFeedback.length > 0) {
    sectionFeedback = raw.sectionFeedback.map((s) => ({
      section: s.section || 'General Section',
      status: ['good', 'needs-improvement', 'missing', 'acceptable'].includes(s.status) ? s.status : 'acceptable',
      currentAssessment: s.currentAssessment || 'Section evaluated against competitive ATS parameters.',
      identifiedIssues: Array.isArray(s.identifiedIssues) ? s.identifiedIssues : [],
      actionableRecommendations: Array.isArray(s.actionableRecommendations) ? s.actionableRecommendations : [],
      suggestedImprovements: s.suggestedImprovements || 'Align wording with target role specifications.',
    }));
  } else {
    sectionFeedback = defaultSections.map((secName) => {
      const lowerText = resumeText.toLowerCase();
      const exists = lowerText.includes(secName.toLowerCase().split(' ')[0]);
      return {
        section: secName,
        status: exists ? 'good' : (secName === 'Certifications' ? 'acceptable' : 'needs-improvement'),
        currentAssessment: exists
          ? `${secName} section is present in the resume and parsed cleanly.`
          : `${secName} was not clearly detected under a dedicated standard heading.`,
        identifiedIssues: exists
          ? []
          : [`Missing explicit "${secName}" section heading, which may cause automated parsers to overlook this information.`],
        actionableRecommendations: exists
          ? [`Ensure all details in ${secName} highlight relevant accomplishments and target role keywords.`]
          : [`Add an explicit "${secName}" section using standard typography to ensure complete parsing.`],
        suggestedImprovements: `Format ${secName} with standard headings, clear dates, and concise bullet points.`,
      };
    });
  }

  return {
    score,
    matchPercentage,
    summary,
    keywordsExtracted,
    missingKeywords,
    suggestions,
    overview,
    contentAnalysis,
    styleAnalysis,
    skillsAnalysis,
    formatAnalysis,
    sectionFeedback,
  };
};

/**
 * Calls Groq with model candidates and fallback
 */
const callGroqWithFallback = async (apiKey, prompt) => {
  const configuredModel = process.env.AI_MODEL;
  // Available models on Groq: qwen/qwen3.8-27b, openai/gpt-oss-120b, llama-3.3-70b-versatile
  const candidateModels = configuredModel
    ? [configuredModel, 'qwen/qwen3.8-27b', 'openai/gpt-oss-120b']
    : ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'llama-3.3-70b-versatile'];

  let lastError = null;
  for (const model of candidateModels) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 4000,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        if (res.status === 404 && errBody.includes('model_not_found')) {
          console.warn(`Groq model ${model} not available on this tier, trying next candidate...`);
          continue;
        }
        throw new Error(`Groq API error (${res.status}): ${errBody}`);
      }

      const resJson = await res.json();
      const content = resJson.choices[0]?.message?.content;
      if (content) return content;
    } catch (err) {
      lastError = err;
      if (err.message.includes('404')) continue;
      throw err;
    }
  }

  throw lastError || new Error('No Groq models available.');
};

/**
 * Analyzes resume text against optional job description using AI.
 */
const analyzeResume = async (resumeText, jobDescription = '') => {
  try {
    const activeDomains = detectDomains(resumeText, jobDescription);
    const domainNames = Array.from(activeDomains).map((d) => DOMAINS[d]?.name || d).join(', ');

    const prompt = `
You are a senior ATS (Applicant Tracking System) software architect and expert executive resume reviewer.
Analyze the following extracted resume text thoroughly and objectively.
Target Engineering Domain: ${domainNames}
${jobDescription ? `Compare it strictly against the target job description:\n${jobDescription}\n` : `Evaluate it against competitive standards within ${domainNames}.`}

Extracted Resume Text:
"""
${resumeText.substring(0, 6000)}
"""

CRITICAL EVALUATION RULES:
1. Ground your analysis ONLY on the actual extracted resume text above and the job description. NEVER invent qualifications, experience, skills, or achievements.
2. DOMAIN-AWARE KEYWORDS:
   - Identify candidate skills and missing requirements strictly relevant to ${domainNames}.
   - Never recommend unrelated branch-specific keywords (e.g. never suggest CAD/CAM or Civil tools for a Software Engineer, or web frameworks for a Civil Engineer, unless the job description explicitly asks for it).
   - Do NOT treat soft skills as technical keywords.
   - Do NOT mark a keyword as missing if its equivalent technology or variation is already present in the resume.
3. Calculate the ATS score (0-100) dynamically, authentically, and unconstrained across the full 0–100 spectrum using these benchmark tiers:
   - High Competitiveness (80–99): Resumes with strong job-description keyword alignment, measurable achievements (metrics, %, numbers), relevant skills, and well-structured, ATS-friendly format receive higher scores (e.g., 87, 91, 94, 96, 98). DO NOT artificially cap strong resumes at 85 or 86! Exceptional candidates MUST be awarded scores above 90.
   - Moderate Competitiveness (50–79): Resumes with partial keyword alignment, limited measurable achievements, or some missing job-relevant skills receive moderate scores (e.g., 56, 68, 75).
   - Low Competitiveness (20–49): Resumes with significant keyword gaps, missing relevant skills, weak descriptions, or ATS parsing issues receive lower scores (e.g., 28, 38, 45).
   - Reflect authentic real-world ATS acceptance probability.
3. Calculate matchPercentage (0-100): The exact mathematical percentage of role-critical qualifications, tools, and competencies satisfied by the resume.
4. Extract matching vs missing keywords accurately.
5. Provide detailed, informative breakdowns for Content, Style, Skills, Format, and Section-by-Section evaluation.
6. Provide EXACTLY 6 high-impact, actionable suggestions with concrete fixes.
7. Keep all individual feedback sentences clear and focused (1-2 sentences per field) so the JSON is fully complete and valid.

Return ONLY a valid JSON object with the following structure (no markdown formatting, no preamble, no backticks):
{
  "score": <number 0-100>,
  "matchPercentage": <number 0-100>,
  "summary": "<2-3 sentence executive summary of overall resume strength and ATS readiness>",
  "keywordsExtracted": [<array of key technical and soft skill keywords found in the resume>],
  "missingKeywords": [<array of important keywords from job description or standard role missing in resume>],
  "suggestions": [
    "<actionable fix 1: keyword integration>",
    "<actionable fix 2: quantifiable metrics & business impact>",
    "<actionable fix 3: action verbs & leadership tone>",
    "<actionable fix 4: structural/section hierarchy>",
    "<actionable fix 5: technical depth & applied tools>",
    "<actionable fix 6: role-specific tailoring>"
  ],
  "overview": {
    "strengthsCount": <number>,
    "criticalIssuesCount": <number>,
    "matchingKeywordsCount": <number>,
    "missingKeywordsCount": <number>,
    "keyTakeaway": "<key takeaway sentence for the candidate>"
  },
  "contentAnalysis": {
    "summaryEvaluation": { "score": <0-100>, "feedback": "<detailed feedback on summary hook and positioning>" },
    "workExperienceEvaluation": { "score": <0-100>, "feedback": "<detailed feedback on role progression and responsibilities>" },
    "educationEvaluation": { "score": <0-100>, "feedback": "<detailed feedback on education credentials and formatting>" },
    "projectsEvaluation": { "score": <0-100>, "feedback": "<detailed feedback on applied project complexity and stack>" },
    "achievementsEvaluation": { "score": <0-100>, "feedback": "<detailed feedback on metrics, percentages, and quantifiable wins>" },
    "strengths": [<array of 3-5 specific observed strengths>],
    "weaknesses": [<array of 2-4 concrete content gaps>]
  },
  "styleAnalysis": {
    "writingQuality": "<assessment of vocabulary, conciseness, and professionalism>",
    "clarityAndReadability": "<assessment of recruiter 6-second scanability>",
    "grammarAndLanguage": "<assessment of grammatical precision and tense consistency>",
    "actionVerbUsage": {
      "score": <0-100>,
      "feedback": "<assessment of dynamic action verbs vs passive voice>",
      "examplesFound": [<array of strong verbs found>],
      "recommendations": [<array of stronger power verbs to use>]
    },
    "sentenceQuality": "<assessment of sentence structure, brevity, and impact>",
    "tone": "<assessment of formal corporate executive tone>"
  },
  "skillsAnalysis": {
    "matchingTechnicalSkills": [<array of technical skills found matching role>],
    "missingTechnicalSkills": [<array of high-priority technical skills missing>],
    "matchingSoftSkills": [<array of demonstrated soft/leadership skills>],
    "missingSoftSkills": [<array of soft skills recommended for the role>],
    "recommendedSkills": [<array of complementary trending skills>]
  },
  "formatAnalysis": {
    "resumeStructure": "<evaluation of resume layout and parsing friendliness>",
    "sectionOrganization": "<evaluation of section hierarchy and logical order>",
    "headingConsistency": "<evaluation of heading casing and naming>",
    "formattingConsistency": "<evaluation of bullet alignments and spacing>",
    "readabilityScore": <number 0-100>,
    "atsCompatibilityRating": "<High | Moderate | Low>",
    "potentialFormattingIssues": [<array of formatting flags e.g. columns, graphics>]
  },
  "sectionFeedback": [
    {
      "section": "Contact Information",
      "status": "<good | needs-improvement | missing | acceptable>",
      "currentAssessment": "<specific assessment>",
      "identifiedIssues": [<array of issues if any>],
      "actionableRecommendations": [<array of recommendations>],
      "suggestedImprovements": "<actionable fix>"
    },
    {
      "section": "Professional Summary",
      "status": "<good | needs-improvement | missing | acceptable>",
      "currentAssessment": "<specific assessment>",
      "identifiedIssues": [<array>],
      "actionableRecommendations": [<array>],
      "suggestedImprovements": "<actionable fix>"
    },
    {
      "section": "Skills",
      "status": "<good | needs-improvement | missing | acceptable>",
      "currentAssessment": "<specific assessment>",
      "identifiedIssues": [<array>],
      "actionableRecommendations": [<array>],
      "suggestedImprovements": "<actionable fix>"
    },
    {
      "section": "Work Experience",
      "status": "<good | needs-improvement | missing | acceptable>",
      "currentAssessment": "<specific assessment>",
      "identifiedIssues": [<array>],
      "actionableRecommendations": [<array>],
      "suggestedImprovements": "<actionable fix>"
    },
    {
      "section": "Projects",
      "status": "<good | needs-improvement | missing | acceptable>",
      "currentAssessment": "<specific assessment>",
      "identifiedIssues": [<array>],
      "actionableRecommendations": [<array>],
      "suggestedImprovements": "<actionable fix>"
    },
    {
      "section": "Education",
      "status": "<good | needs-improvement | missing | acceptable>",
      "currentAssessment": "<specific assessment>",
      "identifiedIssues": [<array>],
      "actionableRecommendations": [<array>],
      "suggestedImprovements": "<actionable fix>"
    },
    {
      "section": "Certifications",
      "status": "<good | needs-improvement | missing | acceptable>",
      "currentAssessment": "<specific assessment>",
      "identifiedIssues": [<array>],
      "actionableRecommendations": [<array>],
      "suggestedImprovements": "<actionable fix>"
    }
  ]
}
`;

    let responseText = '';

    // Provider 1: Free Groq API
    if (process.env.GROQ_API_KEY) {
      responseText = await callGroqWithFallback(process.env.GROQ_API_KEY, prompt);
    }
    // Provider 2: Free Google Gemini API
    else if (process.env.GEMINI_API_KEY) {
      const model = process.env.AI_MODEL || 'gemini-1.5-flash';
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 4000,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errBody}`);
      }

      const resJson = await res.json();
      responseText = resJson.choices[0].message.content;
    }
    // Provider 3: OpenRouter API
    else if (process.env.OPENROUTER_API_KEY) {
      const model = process.env.AI_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 4000,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`OpenRouter API error (${res.status}): ${errBody}`);
      }

      const resJson = await res.json();
      responseText = resJson.choices[0].message.content;
    }
    // Provider 4: OpenAI API
    else if (process.env.OPENAI_API_KEY) {
      const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
      const model = process.env.OPENAI_MODEL || process.env.AI_MODEL || 'gpt-4o-mini';

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          
          max_tokens: 4000,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`OpenAI API error (${res.status}): ${errBody}`);
      }

      const resJson = await res.json();
      responseText = resJson.choices[0].message.content;
    }
    // Provider 5: Hugging Face Inference API
    else {
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      if (!apiKey) {
        throw new Error('HUGGINGFACE_API_KEY is missing or invalid in backend/.env file.');
      }

      const selectedModel = process.env.AI_MODEL || 'meta-llama/Llama-3.3-70B-Instruct';
      const hf = new HfInference(apiKey.trim());

      const response = await hf.chatCompletion({
        model: selectedModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2500,
        temperature: 0.3,
      });

      responseText = response.choices[0].message.content;
    }

    // Clean up potential markdown formatting (e.g. ```json ... ```)
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    }

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Raw AI Response:', responseText);
      throw new Error('AI response did not contain a valid JSON object.');
    }

    const rawParsed = JSON.parse(jsonMatch[0]);
    return normalizeAnalysisOutput(rawParsed, resumeText, jobDescription);

  } catch (error) {
    console.error('AI Analysis Error:', error);

    const errMsg = error.message || '';

    if (errMsg.includes('HUGGINGFACE_API_KEY')) {
      throw error;
    } else if (errMsg.includes('402') || errMsg.toLowerCase().includes('purchase pre-paid credits')) {
      throw new Error(
        'Hugging Face Inference Quota Exceeded (402): Pre-paid credits or a PRO subscription are required for model "' +
        (process.env.AI_MODEL || 'meta-llama/Llama-3.3-70B-Instruct') +
        '". To use a completely free strong model, add GROQ_API_KEY=gsk_... to backend/.env'
      );
    } else if (errMsg.includes('401') || errMsg.toLowerCase().includes('invalid api key')) {
      throw new Error('AI analysis failed: Invalid API Key (401). Please verify your API key in backend/.env.');
    } else if (errMsg.includes('404') && errMsg.includes('model_not_found')) {
      throw new Error('AI analysis failed: Model not found. The model is being updated or re-routed.');
    } else if (errMsg.includes('403') || errMsg.toLowerCase().includes('access denied')) {
      throw new Error('AI analysis failed: Access Denied (403). Please verify your API key permissions.');
    } else if (errMsg.includes('429') || errMsg.toLowerCase().includes('rate limit') || errMsg.toLowerCase().includes('loading')) {
      throw new Error('AI analysis failed: Rate limit reached or model is currently warming up. Please retry in 1 minute.');
    } else if (errMsg.includes('JSON') || error instanceof SyntaxError) {
      throw new Error('AI analysis failed: Could not parse structured report from AI provider. Please retry.');
    }

    throw new Error(`AI analysis failed: ${errMsg || 'Unexpected error occurred during analysis.'}`);
  }
};

module.exports = {
  analyzeResume,
  normalizeAnalysisOutput,
};
