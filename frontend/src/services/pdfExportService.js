import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, readable, professional multi-page PDF report
 * with vector charts for the complete overview, zero overlapping headings,
 * generous spacing, and deep relevant information for all sections.
 *
 * @param {Object} data The comprehensive resume analysis object.
 */
export const downloadResumePdf = (data) => {
  if (!data) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  const bottomThreshold = pageHeight - margin - 20; // Safe bottom limit: 777pt

  let y = margin;

  // Professional Color Palette
  const primaryColor = [15, 23, 42];     // slate-900 (deep dark for high contrast readability)
  const secondaryColor = [51, 65, 85];   // slate-700 (body text)
  const mutedColor = [100, 116, 139];    // slate-500 (labels and metadata)
  const brandColor = [79, 70, 229];      // indigo-600
  const brandLight = [238, 242, 255];    // indigo-50
  const successColor = [16, 185, 129];   // emerald-500
  const successLight = [236, 253, 245];  // emerald-50
  const warningColor = [245, 158, 11];   // amber-500
  const warningLight = [254, 252, 232];  // amber-50
  const dangerColor = [239, 68, 68];     // red-500
  const dangerLight = [254, 242, 242];   // red-50
  const cardBg = [248, 250, 252];        // slate-50
  const borderSubtle = [226, 232, 240];  // slate-200

  // -------------------------------------------------------------
  // HELPER: Page break check with running header
  // -------------------------------------------------------------
  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > bottomThreshold) {
      doc.addPage();
      renderRunningHeader();
    }
  };

  const renderRunningHeader = () => {
    doc.setFontSize(8);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('ResumeGrader.AI — Confidential ATS Analysis Report', margin, 26);
    doc.setDrawColor(borderSubtle[0], borderSubtle[1], borderSubtle[2]);
    doc.setLineWidth(0.75);
    doc.line(margin, 32, pageWidth - margin, 32);
    y = 54; // Start safely below header with extra breathing room
  };

  // -------------------------------------------------------------
  // HELPER: Section Title (Guaranteed spacing, no overlap)
  // -------------------------------------------------------------
  const renderSectionHeader = (title, sectionNumber = '') => {
    checkPageBreak(56);
    y += 14; // Generous space before new section

    // Section Pill indicator
    doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.roundedRect(margin, y - 2, 4, 16, 2, 2, 'F');

    doc.setFontSize(12.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${sectionNumber ? sectionNumber + ' ' : ''}${title}`, margin + 12, y + 10);

    // Divider line
    doc.setDrawColor(borderSubtle[0], borderSubtle[1], borderSubtle[2]);
    doc.setLineWidth(0.75);
    doc.line(margin, y + 20, pageWidth - margin, y + 20);

    y += 34; // Generous space below header before content
  };

  // -------------------------------------------------------------
  // HELPER: Multi-line text paragraph with comfortable line height
  // -------------------------------------------------------------
  const renderParagraph = (text, fontSize = 8.5, isBold = false, color = secondaryColor, customWidth = contentWidth) => {
    if (!text) return;
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);

    const lineHeight = fontSize + 4.5;
    const lines = doc.splitTextToSize(String(text), customWidth);

    checkPageBreak(lines.length * lineHeight + 8);
    doc.text(lines, margin, y);
    y += lines.length * lineHeight + 6;
  };

  // -------------------------------------------------------------
  // HELPER: Render keyword badges / pills in clean rows
  // -------------------------------------------------------------
  const renderPillBadges = (items = [], isSuccess = true) => {
    if (!items || items.length === 0) {
      renderParagraph(isSuccess ? 'None found' : 'None missing — excellent coverage!', 8.5);
      return;
    }

    const pillHeight = 17;
    const paddingX = 8;
    const gap = 6;
    let currentX = margin;

    checkPageBreak(32);

    items.forEach((item) => {
      const cleanItem = String(item).trim();
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      const textWidth = doc.getTextWidth(cleanItem);
      const pillWidth = textWidth + paddingX * 2;

      // Wrap to next line if exceeds boundary
      if (currentX + pillWidth > pageWidth - margin) {
        currentX = margin;
        y += pillHeight + gap;
        checkPageBreak(pillHeight + gap + 10);
      }

      // Pill background & border
      if (isSuccess) {
        doc.setFillColor(successLight[0], successLight[1], successLight[2]);
        doc.setDrawColor(successColor[0], successColor[1], successColor[2]);
        doc.setTextColor(5, 150, 105);
      } else {
        doc.setFillColor(dangerLight[0], dangerLight[1], dangerLight[2]);
        doc.setDrawColor(dangerColor[0], dangerColor[1], dangerColor[2]);
        doc.setTextColor(220, 38, 38);
      }

      doc.setLineWidth(0.5);
      doc.roundedRect(currentX, y - 11, pillWidth, pillHeight, 3, 3, 'FD');
      doc.text(cleanItem, currentX + paddingX, y);

      currentX += pillWidth + gap;
    });

    y += pillHeight + 12; // Extra space after pill rows
  };

  // =============================================================
  // 1. EXECUTIVE HEADER BANNER
  // =============================================================
  const headerHeight = 80;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, y, contentWidth, headerHeight, 6, 6, 'F');
  doc.setDrawColor(borderSubtle[0], borderSubtle[1], borderSubtle[2]);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, contentWidth, headerHeight, 6, 6, 'S');

  // Brand Name & Tagline
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
  const brandTitle = 'ResumeGrader';
  doc.text(brandTitle, margin + 16, y + 29);
  const brandTitleWidth = doc.getTextWidth(brandTitle);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('.AI', margin + 16 + brandTitleWidth, y + 29);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('Confidential Applicant Tracking System (ATS) Audit & Optimization Report', margin + 16, y + 46);

  const formattedDate = new Date(data.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generated: ${formattedDate}`, margin + 16, y + 62);

  // Score Badge in Header (Right side)
  const score = Math.max(0, Math.min(100, Math.round(data.score || 0)));
  const scoreColor = score >= 75 ? successColor : score >= 50 ? warningColor : dangerColor;
  const scoreBadgeWidth = 96;
  const scoreBadgeHeight = 50;
  const scoreBadgeX = pageWidth - margin - scoreBadgeWidth - 14;

  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(scoreBadgeX, y + 15, scoreBadgeWidth, scoreBadgeHeight, 6, 6, 'F');

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${score}`, scoreBadgeX + scoreBadgeWidth / 2, y + 41, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('ATS SCORE / 100', scoreBadgeX + scoreBadgeWidth / 2, y + 54, { align: 'center' });

  y += headerHeight + 16;

  // =============================================================
  // 2. METADATA INFO CARD
  // =============================================================
  const metaHeight = 46;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, metaHeight, 4, 4, 'F');
  doc.setDrawColor(borderSubtle[0], borderSubtle[1], borderSubtle[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, metaHeight, 4, 4, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Resume File:', margin + 12, y + 19);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const filename = data.originalFilename || 'Uploaded_Resume.pdf';
  doc.text(filename.length > 38 ? filename.substring(0, 36) + '...' : filename, margin + 74, y + 19);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Role Match:', margin + 12, y + 33);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(`${data.matchPercentage || score}% Alignment Score`, margin + 74, y + 33);

  const col2X = pageWidth / 2 + 10;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Target Role:', col2X, y + 19);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const jobPreview = data.jobDescription
    ? (data.jobDescription.length > 34 ? data.jobDescription.substring(0, 32) + '...' : data.jobDescription)
    : 'Standard Industry Benchmark';
  doc.text(jobPreview, col2X + 64, y + 19);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('ATS Rating:', col2X, y + 33);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(data.formatAnalysis?.atsCompatibilityRating || (score >= 75 ? 'High Compatibility' : 'Needs Optimization'), col2X + 64, y + 33);

  y += metaHeight + 16;

  // =============================================================
  // 3. COMPLETE OVERVIEW & EXECUTIVE SUMMARY
  // =============================================================
  renderSectionHeader('Executive Overview & Key Insights', 'A.');

  if (data.summary) {
    renderParagraph(data.summary, 9, false, secondaryColor);
    y += 4;
  }

  // 4 Top Metric Cards
  checkPageBreak(54);
  const metricCardWidth = (contentWidth - 24) / 4;
  const metricCards = [
    { label: 'Overall ATS Score', val: `${score}/100`, color: scoreColor },
    { label: 'Target Job Match', val: `${data.matchPercentage || score}%`, color: brandColor },
    { label: 'Matching Keywords', val: `${data.keywordsExtracted?.length || 0}`, color: successColor },
    { label: 'Missing Gaps', val: `${data.missingKeywords?.length || 0}`, color: dangerColor },
  ];

  metricCards.forEach((mc, idx) => {
    const cardX = margin + idx * (metricCardWidth + 8);
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(cardX, y, metricCardWidth, 44, 4, 4, 'F');
    doc.setDrawColor(borderSubtle[0], borderSubtle[1], borderSubtle[2]);
    doc.setLineWidth(0.75);
    doc.roundedRect(cardX, y, metricCardWidth, 44, 4, 4, 'S');

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(mc.color[0], mc.color[1], mc.color[2]);
    doc.text(mc.val, cardX + metricCardWidth / 2, y + 21, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text(mc.label, cardX + metricCardWidth / 2, y + 35, { align: 'center' });
  });

  y += 58;

  // =============================================================
  // 4. VISUAL GRAPHS (BASED ON COMPLETE OVERVIEW)
  // =============================================================
  checkPageBreak(175);

  const graphContainerHeight = 172;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, y, contentWidth, graphContainerHeight, 6, 6, 'F');
  doc.setDrawColor(borderSubtle[0], borderSubtle[1], borderSubtle[2]);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, y, contentWidth, graphContainerHeight, 6, 6, 'S');

  let graphY = y + 16;

  // Graph Header
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Visual Performance Graphs (Overview)', margin + 14, graphY);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('Real-time calculations across ATS scoring, keyword coverage & evaluation categories', margin + 14, graphY + 12);
  graphY += 28;

  // --- Graph 1: ATS Overall Compatibility Bar ---
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Overall ATS Readiness Score:', margin + 14, graphY);
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${score}%`, pageWidth - margin - 14, graphY, { align: 'right' });

  const barWidth = contentWidth - 28;
  const barHeight = 8;
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(margin + 14, graphY + 4, barWidth, barHeight, 3, 3, 'F');

  const fillWidth = Math.max(8, (score / 100) * barWidth);
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(margin + 14, graphY + 4, fillWidth, barHeight, 3, 3, 'F');

  graphY += 28;

  // --- Graph 2: Keyword Match vs. Missing Ratio Split Bar ---
  const matchKwsCount = data.keywordsExtracted?.length || 0;
  const missKwsCount = data.missingKeywords?.length || 0;
  const totalKws = matchKwsCount + missKwsCount;
  const matchPct = totalKws > 0 ? Math.round((matchKwsCount / totalKws) * 100) : score;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Keyword Density Ratio (Found vs. Missing):', margin + 14, graphY);

  // Dynamic positioning to strictly prevent any text collision or overlap
  const rightMarginX = pageWidth - margin - 14;
  const missStr = `${missKwsCount} Missing (${100 - matchPct}%)`;
  const matchStr = `${matchKwsCount} Found (${matchPct}%)`;

  const missWidth = doc.getTextWidth(missStr);

  // 1. Render Missing on the far right edge
  doc.setTextColor(dangerColor[0], dangerColor[1], dangerColor[2]);
  doc.text(missStr, rightMarginX, graphY, { align: 'right' });

  // 2. Render Found safely to the left of Missing with a guaranteed 16pt gap
  const matchRightX = rightMarginX - missWidth - 16;
  doc.setTextColor(successColor[0], successColor[1], successColor[2]);
  doc.text(matchStr, matchRightX, graphY, { align: 'right' });

  // Draw background bar (Missing / unfilled portion)
  doc.setFillColor(dangerLight[0], dangerLight[1], dangerLight[2]);
  doc.roundedRect(margin + 14, graphY + 4, barWidth, barHeight, 3, 3, 'F');

  // Draw matching bar (Found portion)
  const matchBarWidth = (matchPct / 100) * barWidth;
  if (matchBarWidth > 0) {
    doc.setFillColor(successColor[0], successColor[1], successColor[2]);
    doc.roundedRect(margin + 14, graphY + 4, matchBarWidth, barHeight, 3, 3, 'F');
  }

  graphY += 28;

  // --- Graph 3: 4 Category Pillars Audit ---
  const contentScore = Math.round(
    ((data.contentAnalysis?.summaryEvaluation?.score || 70) +
      (data.contentAnalysis?.workExperienceEvaluation?.score || 70) +
      (data.contentAnalysis?.educationEvaluation?.score || 75) +
      (data.contentAnalysis?.projectsEvaluation?.score || 70) +
      (data.contentAnalysis?.achievementsEvaluation?.score || 65)) / 5
  );
  const styleScore = data.styleAnalysis?.actionVerbUsage?.score || 75;
  const skillsScore = matchPct;
  const formatScore = data.formatAnalysis?.readabilityScore || Math.min(100, score + 5);

  const categories = [
    { name: 'Content & Impact', sc: contentScore, col: [79, 70, 229] },
    { name: 'Keyword Alignment', sc: skillsScore, col: [16, 185, 129] },
    { name: 'Writing & Style', sc: styleScore, col: [14, 165, 233] },
    { name: 'ATS Structure', sc: formatScore, col: [245, 158, 11] },
  ];

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('4-Pillar Performance Audit Breakdown:', margin + 14, graphY);
  graphY += 13;

  const colWidth = (barWidth - 18) / 4;
  categories.forEach((cat, cIdx) => {
    const colX = margin + 14 + cIdx * (colWidth + 6);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(cat.name, colX, graphY);

    doc.setTextColor(cat.col[0], cat.col[1], cat.col[2]);
    doc.text(`${cat.sc}%`, colX + colWidth, graphY, { align: 'right' });

    doc.setFillColor(226, 232, 240);
    doc.roundedRect(colX, graphY + 4, colWidth, 5, 2, 2, 'F');

    const catFill = Math.max(3, (cat.sc / 100) * colWidth);
    doc.setFillColor(cat.col[0], cat.col[1], cat.col[2]);
    doc.roundedRect(colX, graphY + 4, catFill, 5, 2, 2, 'F');
  });

  y += graphContainerHeight + 18;

  // =============================================================
  // 5. SECTION B: CONTENT ANALYSIS
  // =============================================================
  renderSectionHeader('Resume Content Analysis & Experience Impact', 'B.');

  if (data.contentAnalysis) {
    const ca = data.contentAnalysis;
    const contentEvals = [
      { name: 'Professional Summary & Candidate Hook', item: ca.summaryEvaluation },
      { name: 'Work Experience Progression & Responsibilities', item: ca.workExperienceEvaluation },
      { name: 'Quantifiable Business Achievements & Metrics', item: ca.achievementsEvaluation },
      { name: 'Technical Depth & Applied Projects', item: ca.projectsEvaluation },
      { name: 'Education Credentials & Academic Relevance', item: ca.educationEvaluation },
    ];

    contentEvals.forEach((ce) => {
      if (ce.item) {
        checkPageBreak(42);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`• ${ce.name}`, margin, y);

        const ceScore = ce.item.score || 70;
        const ceColor = ceScore >= 75 ? successColor : ceScore >= 50 ? warningColor : dangerColor;
        doc.setTextColor(ceColor[0], ceColor[1], ceColor[2]);
        doc.text(`Score: ${ceScore}/100`, pageWidth - margin - 4, y, { align: 'right' });
        y += 13;

        renderParagraph(ce.item.feedback, 8.5, false, secondaryColor);
        y += 4;
      }
    });

    // Content Strengths & Weaknesses
    if (ca.strengths?.length) {
      checkPageBreak(36);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(successColor[0], successColor[1], successColor[2]);
      doc.text('Key Content Strengths Observed:', margin, y);
      y += 13;
      ca.strengths.forEach((s) => {
        renderParagraph(`+ ${s}`, 8.5, false, secondaryColor);
      });
      y += 6;
    }

    if (ca.weaknesses?.length) {
      checkPageBreak(36);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(dangerColor[0], dangerColor[1], dangerColor[2]);
      doc.text('Content Gaps & Areas to Strengthen:', margin, y);
      y += 13;
      ca.weaknesses.forEach((w) => {
        renderParagraph(`- ${w}`, 8.5, false, secondaryColor);
      });
      y += 8;
    }
  }

  // =============================================================
  // 6. SECTION C: STYLE & WRITING ANALYSIS
  // =============================================================
  renderSectionHeader('Style, Professional Writing & Tone', 'C.');

  if (data.styleAnalysis) {
    const sa = data.styleAnalysis;
    const styleDetails = [
      { label: 'Writing Vocabulary & Conciseness', val: sa.writingQuality },
      { label: 'Recruiter Clarity & 6-Second Scanability', val: sa.clarityAndReadability },
      { label: 'Grammar, Punctuation & Tense Consistency', val: sa.grammarAndLanguage },
      { label: 'Sentence Economy & Flow', val: sa.sentenceQuality },
      { label: 'Professional Corporate Tone', val: sa.tone },
    ];

    styleDetails.forEach((sd) => {
      if (sd.val) {
        checkPageBreak(36);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`• ${sd.label}:`, margin, y);
        y += 12;
        renderParagraph(sd.val, 8.5, false, secondaryColor);
        y += 4;
      }
    });

    if (sa.actionVerbUsage) {
      checkPageBreak(44);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`• Action Verb Usage & Leadership Verbs:`, margin, y);
      doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.text(`Score: ${sa.actionVerbUsage.score || 75}/100`, pageWidth - margin - 4, y, { align: 'right' });
      y += 12;
      renderParagraph(sa.actionVerbUsage.feedback, 8.5, false, secondaryColor);

      if (sa.actionVerbUsage.examplesFound?.length) {
        renderParagraph(`Verbs Detected: ${sa.actionVerbUsage.examplesFound.join(', ')}`, 8.5, false, mutedColor);
      }
      if (sa.actionVerbUsage.recommendations?.length) {
        renderParagraph(`Recommended Power Verbs: ${sa.actionVerbUsage.recommendations.join(', ')}`, 8.5, true, brandColor);
      }
      y += 6;
    }
  }

  // =============================================================
  // 7. SECTION D: SKILLS BREAKDOWN
  // =============================================================
  renderSectionHeader('Categorized Skills Breakdown & Keyword Alignment', 'D.');

  if (data.skillsAnalysis) {
    const sk = data.skillsAnalysis;

    if (sk.matchingTechnicalSkills?.length || data.keywordsExtracted?.length) {
      const matchTech = sk.matchingTechnicalSkills?.length ? sk.matchingTechnicalSkills : data.keywordsExtracted;
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(successColor[0], successColor[1], successColor[2]);
      doc.text(`Matching Technical Skills Found (${matchTech.length}):`, margin, y);
      y += 13;
      renderPillBadges(matchTech, true);
    }

    if (sk.missingTechnicalSkills?.length || data.missingKeywords?.length) {
      const missTech = sk.missingTechnicalSkills?.length ? sk.missingTechnicalSkills : data.missingKeywords;
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(dangerColor[0], dangerColor[1], dangerColor[2]);
      doc.text(`Missing Role-Critical Technical Skills (${missTech.length}):`, margin, y);
      y += 13;
      renderPillBadges(missTech, false);
    }

    if (sk.matchingSoftSkills?.length) {
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`Demonstrated Soft & Interpersonal Skills:`, margin, y);
      y += 13;
      renderPillBadges(sk.matchingSoftSkills, true);
    }

    if (sk.missingSoftSkills?.length) {
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(warningColor[0], warningColor[1], warningColor[2]);
      doc.text(`Recommended Soft & Leadership Skills:`, margin, y);
      y += 13;
      renderPillBadges(sk.missingSoftSkills, false);
    }

    if (sk.recommendedSkills?.length) {
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.text(`Recommended High-Value Adjacent Skills:`, margin, y);
      y += 13;
      renderPillBadges(sk.recommendedSkills, true);
    }
  }

  // =============================================================
  // 8. SECTION E: FORMAT & ATS STRUCTURAL INTEGRITY
  // =============================================================
  renderSectionHeader('Format & ATS Structural Integrity', 'E.');

  if (data.formatAnalysis) {
    const fa = data.formatAnalysis;
    const formatItems = [
      { label: 'Layout Architecture', val: fa.resumeStructure },
      { label: 'Section Hierarchy & Organization', val: fa.sectionOrganization },
      { label: 'Heading Casing & Naming Standards', val: fa.headingConsistency },
      { label: 'Bullet Points & Margin Alignment', val: fa.formattingConsistency },
      { label: 'ATS Compatibility Rating', val: `${fa.atsCompatibilityRating || 'Standard'} (Readability Index: ${fa.readabilityScore || 85}/100)` },
    ];

    formatItems.forEach((fi) => {
      if (fi.val) {
        checkPageBreak(34);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`• ${fi.label}:`, margin, y);
        y += 12;
        renderParagraph(fi.val, 8.5, false, secondaryColor);
        y += 4;
      }
    });

    if (fa.potentialFormattingIssues?.length) {
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(dangerColor[0], dangerColor[1], dangerColor[2]);
      doc.text('Potential Parsing Flags Detected:', margin, y);
      y += 12;
      fa.potentialFormattingIssues.forEach((flag) => {
        renderParagraph(`! ${flag}`, 8.5, false, dangerColor);
      });
      y += 4;
    }
  }

  // =============================================================
  // 9. SECTION F: SECTION-BY-SECTION AUDIT
  // =============================================================
  if (data.sectionFeedback?.length) {
    renderSectionHeader('Section-by-Section Quality Audit', 'F.');

    data.sectionFeedback.forEach((sec) => {
      // Calculate needed height for this entire card to ensure it stays unified
      checkPageBreak(85);

      const isGood = sec.status === 'good';
      const isNeedsWork = sec.status === 'needs-improvement';
      const statusColor = isGood ? successColor : isNeedsWork ? warningColor : dangerColor;
      const statusLabel = isGood ? 'WELL STRUCTURED' : isNeedsWork ? 'NEEDS IMPROVEMENT' : 'MISSING / INCOMPLETE';

      // Section title row
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`Section: ${sec.section}`, margin, y);

      // Status Tag on right
      doc.setFontSize(8);
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.text(`[${statusLabel}]`, pageWidth - margin - 4, y, { align: 'right' });
      y += 14;

      if (sec.currentAssessment) {
        renderParagraph(`Assessment: ${sec.currentAssessment}`, 8.5, false, secondaryColor);
      }
      if (sec.identifiedIssues?.length) {
        renderParagraph(`Issues Identified: ${sec.identifiedIssues.join('; ')}`, 8.5, false, dangerColor);
      }
      if (sec.actionableRecommendations?.length) {
        renderParagraph(`Actionable Recommendation: ${sec.actionableRecommendations.join('; ')}`, 8.5, false, brandColor);
      }
      if (sec.suggestedImprovements) {
        renderParagraph(`Recommended Blueprint: ${sec.suggestedImprovements}`, 8.5, true, [5, 150, 105]);
      }

      y += 8; // Generous space between section blocks
    });
  }

  // =============================================================
  // 10. ACTIONABLE FIXES (EXACTLY 6 PRIORITY DIRECTIVES)
  // =============================================================
  if (data.suggestions?.length) {
    renderSectionHeader('Top Actionable Improvement Directives (6)', 'Actionable Fixes');

    const fixesList = data.suggestions.slice(0, 6);
    fixesList.forEach((sug, idx) => {
      checkPageBreak(46);

      // Number badge
      doc.setFillColor(brandLight[0], brandLight[1], brandLight[2]);
      doc.roundedRect(margin, y - 9, 22, 16, 3, 3, 'F');
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.text(`#${idx + 1}`, margin + 11, y + 2, { align: 'center' });

      // Suggestion content
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      const sugLines = doc.splitTextToSize(String(sug), contentWidth - 32);
      doc.text(sugLines, margin + 30, y);
      y += sugLines.length * 13 + 12; // Generous breathing room after each fix
    });
  }

  // =============================================================
  // 11. RUNNING FOOTERS WITH ACCURATE DYNAMIC PAGE NUMBERS
  // =============================================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);

    // Footer divider line
    doc.setDrawColor(borderSubtle[0], borderSubtle[1], borderSubtle[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 28, pageWidth - margin, pageHeight - 28);

    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 16, { align: 'center' });
    doc.text('ResumeGrader.AI', margin, pageHeight - 16);
    doc.text('Confidential Career Document', pageWidth - margin, pageHeight - 16, { align: 'right' });
  }

  // Download File with clean meaningful filename
  const cleanName = (data.originalFilename || 'Resume')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Resume_Analysis_Report_${cleanName}.pdf`);
};
