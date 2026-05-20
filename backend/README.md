# AI-Powered Resume Grader - Backend

This is the backend service for the AI-Powered Resume Grader application, built with Node.js, Express, and MongoDB. It handles PDF resume uploads, parses text from the PDFs, and interacts with the Hugging Face API to analyze and grade the resumes.

## Technologies Used
- **Node.js & Express.js**: Server framework and API routing.
- **Mongoose**: MongoDB object modeling tool.
- **@huggingface/inference**: Hugging Face Inference API SDK for AI-powered resume analysis.
- **multer**: Middleware for handling `multipart/form-data` (file uploads).
- **pdf-parse**: Extracts text content from uploaded PDF resumes.
- **cors**: Enables Cross-Origin Resource Sharing for the frontend to communicate with the backend.
- **dotenv**: Loads environment variables from a `.env` file.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance running
- Hugging Face API key

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the backend directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

### Running the Server
Start the development server:
```bash
npm start
```
The server will typically run on `http://localhost:5000`.
