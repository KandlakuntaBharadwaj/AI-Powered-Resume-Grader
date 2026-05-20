const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing or invalid in .env file.');
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const analyzeResume = async (resumeText, jobDescription = '') => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const prompt = `
      You are an expert ATS (Applicant Tracking System) and resume reviewer. 
      Analyze the following resume text.
      ${jobDescription ? `Also compare it against the following job description: \n${jobDescription}\n` : ''}
      
      Resume Text:
      ${resumeText}
      
      Provide your analysis in JSON format with exactly the following structure:
      {
        "score": <a number between 0 and 100 representing the resume strength for ATS>,
        "keywordsExtracted": [<array of key technical/soft skill keywords found in the resume>],
        "missingKeywords": [<array of important keywords missing, based on standard tech roles or the provided job description>],
        "suggestions": [<array of 3-5 specific, actionable suggestions to improve the resume>]
      }
      
      Only output valid JSON. Do not include markdown code blocks.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting and extract JSON
    let jsonString = '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    } else {
      throw new Error('Could not find JSON in AI response');
    }
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('FULL GEMINI ERROR:', error);
    console.error('Error analyzing resume with AI:', error);
    
    if (error.status === 403) {
      throw new Error('AI analysis failed: Access Denied. Please check your API key permissions.');
    } else if (error.status === 429) {
      throw new Error('AI analysis failed: Quota exceeded. Please try again later.');
    } else if (error.message.includes('JSON')) {
      throw new Error('AI analysis failed: Unexpected response format from AI.');
    }
    throw new Error('AI analysis failed. Please check your API key and try again.');
  }
};

module.exports = {
  analyzeResume,
};
