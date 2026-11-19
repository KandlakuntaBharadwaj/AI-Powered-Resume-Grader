/**
 * Domain-Aware Keyword Matching & Classification Service for ResumeGrader.AI
 */

const { DOMAINS, KEYWORDS } = require('../data/keywordDatabase');

/**
 * Detects the candidate's active engineering domain(s) using resume text and target job description.
 *
 * @param {string} resumeText
 * @param {string} jobDescription
 * @returns {Set<string>} Set of active domain IDs (e.g., 'CSE', 'AI_ML', 'ECE', etc.)
 */
const detectDomains = (resumeText = '', jobDescription = '') => {
  const combinedText = `${resumeText} ${jobDescription}`.toLowerCase();
  const detected = new Set();
  const domainScores = {};

  // Initialize scores
  Object.keys(DOMAINS).forEach((domKey) => {
    domainScores[domKey] = 0;
  });

  // 1. Check domain-specific identifiers
  Object.entries(DOMAINS).forEach(([domKey, domObj]) => {
    domObj.identifiers.forEach((ident) => {
      const regex = new RegExp(`\\b${ident.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(combinedText)) {
        // Job description matches carry higher weight
        const jdRegex = new RegExp(`\\b${ident.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const weight = jdRegex.test(jobDescription.toLowerCase()) ? 4 : 2;
        domainScores[domKey] += weight;
      }
    });
  });

  // 2. Tally technical keywords present in the text per domain
  KEYWORDS.forEach((kw) => {
    if (kw.domains.includes('ALL')) return;

    let matched = false;
    for (const variation of kw.variations) {
      if (variation.test(combinedText)) {
        matched = true;
        break;
      }
    }

    if (matched) {
      kw.domains.forEach((dom) => {
        if (domainScores[dom] !== undefined) {
          domainScores[dom] += 1;
        }
      });
    }
  });

  // Determine threshold
  const sortedDomains = Object.entries(domainScores).sort((a, b) => b[1] - a[1]);
  const highestScore = sortedDomains[0] ? sortedDomains[0][1] : 0;

  if (highestScore > 0) {
    // Include the top domain, plus any secondary domain with at least 40% of the top score
    sortedDomains.forEach(([dom, sc]) => {
      if (sc >= Math.max(3, highestScore * 0.4)) {
        detected.add(dom);
      }
    });
  }

  // Fallback: Default to CSE if no specific engineering branch could be determined
  if (detected.size === 0) {
    detected.add('CSE');
  }

  return detected;
};

/**
 * Extracts all matching canonical keywords from text.
 *
 * @param {string} text
 * @returns {Array<Object>} List of matched keyword objects from database
 */
const extractKeywordsFromText = (text = '') => {
  if (!text || typeof text !== 'string') return [];

  const matchedKeywords = [];
  const matchedCanonicalSet = new Set();

  KEYWORDS.forEach((kw) => {
    // Check all regex variations
    let isPresent = false;
    for (const regex of kw.variations) {
      if (regex.test(text)) {
        isPresent = true;
        break;
      }
    }

    if (isPresent && !matchedCanonicalSet.has(kw.canonical.toLowerCase())) {
      matchedCanonicalSet.add(kw.canonical.toLowerCase());
      matchedKeywords.push(kw);
    }
  });

  return matchedKeywords;
};

/**
 * Checks whether a given keyword or its equivalent exists in the resume.
 *
 * @param {string} keywordName
 * @param {string} resumeText
 * @param {Set<string>} foundCanonicalSet
 * @returns {boolean}
 */
const isEquivalentPresentInResume = (keywordName, resumeText = '', foundCanonicalSet = new Set()) => {
  const normName = keywordName.trim().toLowerCase();

  // 1. Direct canonical check
  if (foundCanonicalSet.has(normName)) {
    return true;
  }

  // 2. Database alias / variation check
  const kwEntry = KEYWORDS.find((k) =>
    k.canonical.toLowerCase() === normName ||
    k.variations.some((v) => {
      // test against the raw string or pattern
      const sample = v.toString().replace(/^\/|\/[a-z]*$/g, '').replace(/\\b/g, '').toLowerCase();
      return sample.includes(normName) || normName.includes(sample);
    })
  );

  if (kwEntry) {
    // If the canonical is in found set, it's present
    if (foundCanonicalSet.has(kwEntry.canonical.toLowerCase())) {
      return true;
    }
    // Test resume text with this keyword's variations
    for (const regex of kwEntry.variations) {
      if (regex.test(resumeText)) {
        foundCanonicalSet.add(kwEntry.canonical.toLowerCase());
        return true;
      }
    }
  }

  return false;
};

/**
 * Performs domain-aware classification and filtering of resume keywords.
 * Integrates raw AI extracted results with strict domain boundaries and equivalency deduplication.
 *
 * @param {string} resumeText
 * @param {string} jobDescription
 * @param {Array<string>} aiExtractedRaw
 * @param {Array<string>} aiMissingRaw
 * @returns {Object} Cleaned, domain-aware keyword analysis
 */
const processDomainKeywords = (
  resumeText = '',
  jobDescription = '',
  aiExtractedRaw = [],
  aiMissingRaw = []
) => {
  // 1. Detect active domain(s)
  const activeDomains = detectDomains(resumeText, jobDescription);

  // 2. Deterministically extract verified keywords from resume text
  const verifiedResumeKeywords = extractKeywordsFromText(resumeText);
  const foundCanonicalSet = new Set(verifiedResumeKeywords.map((k) => k.canonical.toLowerCase()));

  // 3. Process AI raw extracted keywords (preserve valid candidate findings without duplicates)
  const matchingTechnical = new Set();
  const matchingSoft = new Set();

  // Add verified technical and soft keywords from our comprehensive database
  verifiedResumeKeywords.forEach((kw) => {
    if (kw.type === 'soft') {
      matchingSoft.add(kw.canonical);
    } else {
      matchingTechnical.add(kw.canonical);
    }
  });

  // Also retain valid AI-identified skills if they aren't duplicates
  if (Array.isArray(aiExtractedRaw)) {
    aiExtractedRaw.forEach((rawKw) => {
      if (!rawKw || typeof rawKw !== 'string') return;
      const trimmed = rawKw.trim();
      if (trimmed.length < 2 || trimmed.length > 35) return;

      // Filter out overly generic non-technical phrases
      const lower = trimmed.toLowerCase();
      const genericPhrases = ['skills', 'tools', 'technologies', 'proficient', 'experience', 'worked on', 'knowledge of'];
      if (genericPhrases.includes(lower)) return;

      // Check if it corresponds to a known database keyword
      const dbMatch = KEYWORDS.find((k) =>
        k.canonical.toLowerCase() === lower || k.variations.some((v) => v.test(trimmed))
      );

      if (dbMatch) {
        if (dbMatch.type === 'soft') {
          matchingSoft.add(dbMatch.canonical);
        } else {
          matchingTechnical.add(dbMatch.canonical);
        }
        foundCanonicalSet.add(dbMatch.canonical.toLowerCase());
      } else {
        // Candidate has a unique skill not in database (e.g. specialized library)
        matchingTechnical.add(trimmed);
        foundCanonicalSet.add(lower);
      }
    });
  }

  // 4. Determine domain-relevant missing keywords
  const missingTechnical = new Set();
  const missingSoft = new Set();
  const recommendedSkills = new Set();

  // A. Check if Job Description contains required keywords not in resume
  if (jobDescription && jobDescription.trim().length > 0) {
    const jdKeywords = extractKeywordsFromText(jobDescription);
    jdKeywords.forEach((kw) => {
      // Must not already be present in resume (directly or through equivalent)
      if (!isEquivalentPresentInResume(kw.canonical, resumeText, foundCanonicalSet)) {
        if (kw.type === 'soft') {
          missingSoft.add(kw.canonical);
        } else {
          missingTechnical.add(kw.canonical);
        }
      }
    });
  }

  // B. Process AI-suggested missing keywords with DOMAIN FILTERING
  if (Array.isArray(aiMissingRaw)) {
    aiMissingRaw.forEach((rawMiss) => {
      if (!rawMiss || typeof rawMiss !== 'string') return;
      const trimmed = rawMiss.trim();
      const lower = trimmed.toLowerCase();

      // Equivalency check: Do not mark as missing if already in resume!
      if (isEquivalentPresentInResume(trimmed, resumeText, foundCanonicalSet)) {
        return;
      }

      // Check against database to enforce domain relevance
      const dbMatch = KEYWORDS.find((k) =>
        k.canonical.toLowerCase() === lower || k.variations.some((v) => v.test(trimmed))
      );

      if (dbMatch) {
        // Enforce branch/domain boundary: NEVER add unrelated branch keyword!
        const isDomainRelevant =
          dbMatch.domains.includes('ALL') ||
          dbMatch.domains.some((d) => activeDomains.has(d));

        if (isDomainRelevant) {
          if (dbMatch.type === 'soft') {
            missingSoft.add(dbMatch.canonical);
          } else {
            missingTechnical.add(dbMatch.canonical);
          }
        }
      } else {
        // If not in database, only accept if it doesn't mention an explicitly foreign branch
        const foreignBranchKeywords = [
          'autocad', 'staad', 'etabs', 'revit', 'vlsi', 'verilog', 'vhdl', 'matlab',
          'solidworks', 'ansys', 'catia', 'scada', 'plc', 'cnc', 'rcc'
        ];
        const isForeign = foreignBranchKeywords.some((fb) => lower.includes(fb));

        if (!isForeign || activeDomains.has('CIVIL') || activeDomains.has('MECHANICAL') || activeDomains.has('ECE') || activeDomains.has('EEE')) {
          missingTechnical.add(trimmed);
        }
      }
    });
  }

  // C. If missing technical keywords is low (< 3), suggest domain-relevant high-impact skills
  if (missingTechnical.size < 3) {
    const candidateKws = KEYWORDS.filter(
      (k) =>
        k.type !== 'soft' &&
        k.domains.some((d) => activeDomains.has(d)) &&
        !foundCanonicalSet.has(k.canonical.toLowerCase())
    );

    // Pick top domain-relevant technologies to recommend
    for (const kw of candidateKws) {
      if (missingTechnical.size >= 6) break;
      if (!isEquivalentPresentInResume(kw.canonical, resumeText, foundCanonicalSet)) {
        missingTechnical.add(kw.canonical);
      }
    }
  }

  // D. Populate Recommended Skills (cross-domain or advanced trends within active domain)
  const advancedKeywords = KEYWORDS.filter(
    (k) =>
      k.domains.some((d) => activeDomains.has(d)) &&
      !foundCanonicalSet.has(k.canonical.toLowerCase()) &&
      !missingTechnical.has(k.canonical)
  );

  for (const kw of advancedKeywords) {
    if (recommendedSkills.size >= 5) break;
    recommendedSkills.add(kw.canonical);
  }

  // Ensure default soft skills if none missing
  if (missingSoft.size === 0) {
    const defaultSoft = ['System Ownership', 'Cross-Functional Collaboration', 'Stakeholder Alignment'];
    defaultSoft.forEach((s) => {
      if (!matchingSoft.has(s)) missingSoft.add(s);
    });
  }

  // Combine for global keywords arrays
  const keywordsExtracted = Array.from(matchingTechnical).concat(Array.from(matchingSoft));
  const missingKeywords = Array.from(missingTechnical).concat(Array.from(missingSoft));

  return {
    activeDomains: Array.from(activeDomains).map((d) => DOMAINS[d]?.name || d),
    keywordsExtracted,
    missingKeywords,
    skillsAnalysis: {
      matchingTechnicalSkills: Array.from(matchingTechnical),
      missingTechnicalSkills: Array.from(missingTechnical),
      matchingSoftSkills: Array.from(matchingSoft),
      missingSoftSkills: Array.from(missingSoft),
      recommendedSkills: Array.from(recommendedSkills),
    },
  };
};

module.exports = {
  detectDomains,
  extractKeywordsFromText,
  isEquivalentPresentInResume,
  processDomainKeywords,
};
