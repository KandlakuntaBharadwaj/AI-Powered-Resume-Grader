const { HfInference } = require('@huggingface/inference');

const analyzeResume = async (resumeText, jobDescription = '') => {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error('HUGGINGFACE_API_KEY is missing or invalid in .env file.');
    }

    const hf = new HfInference(apiKey);

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

    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.2
    });

    const responseText = response.choices[0].message.content;
    
    // Clean up potential markdown formatting and extract JSON
    let jsonString = '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    } else {
      console.log('Raw response:', responseText);
      throw new Error('Could not find JSON in AI response');
    }
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('FULL HUGGING FACE ERROR:', error);
    console.error('Error analyzing resume with AI:', error);
    
    if (error.message.includes('403')) {
      throw new Error('AI analysis failed: Access Denied. Please check your API key permissions.');
    } else if (error.message.includes('429')) {
      throw new Error('AI analysis failed: Quota exceeded or Model is loading. Please try again later.');
    } else if (error.message.includes('JSON') || error instanceof SyntaxError) {
      throw new Error('AI analysis failed: Unexpected response format from AI.');
    }
    throw new Error('AI analysis failed. Please check your API key and try again.');
  }
};

module.exports = {
  analyzeResume,
};
