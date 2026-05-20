const { HfInference } = require('@huggingface/inference');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    console.log("Testing Hugging Face API with key:", apiKey ? "Loaded" : "Missing");

    const hf = new HfInference(apiKey);
    const prompt = "Please respond with a JSON object containing a greeting message. Example: {\"message\": \"Hello World\"}";
    
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.2
    });

    console.log("Response:", response.choices[0].message.content);
  } catch(e) {
    console.error("ERROR:", e.message);
  }
}
run();
