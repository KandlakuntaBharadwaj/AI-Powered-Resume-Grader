const { HfInference } = require('@huggingface/inference');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
  const model = "meta-llama/Llama-3.3-70B-Instruct";
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  console.log("Testing Hugging Face API with key:", apiKey ? "Loaded" : "Missing");

  if (!apiKey) return;

  const hf = new HfInference(apiKey);
  const prompt = "Respond with a JSON object containing a greeting message. Example: {\"message\": \"Hello World\"}";

  console.log(`Testing model: ${model}`);
  try {
    const response = await hf.chatCompletion({
      model: model,
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.2
    });

    console.log("Success! Response:", response.choices[0].message.content.trim());
  } catch(e) {
    console.error("Error:", e.message);
  }
}
run();
