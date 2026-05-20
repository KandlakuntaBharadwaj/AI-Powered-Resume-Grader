# AI-Powered Resume Grader: Comprehensive Code Breakdown

This document provides a deep, technical, line-by-line/block-by-block explanation of the code for every crucial file in the Backend and Frontend of the AI-Powered Resume Grader application.

---

## Part 1: Backend Architecture (`/backend`)

The backend is an Express API that handles PDF parsing and communicates with the Hugging Face Inference API.

### 1. `backend/server.js`
This is the main entry point for the Node.js application.
*   **Lines 1-7**: Imports required modules. `express` for the web server, `dotenv` for environment variables, `cors` to allow frontend requests, `connectDB` to hook up MongoDB, and `fs`/`path` for file system operations.
*   **Lines 10-13**: Calls `dotenv.config()` to load the `.env` file into `process.env`. Then calls `connectDB()` to connect to the database.
*   **Lines 15-19**: Initializes the `express()` app and applies global middlewares. `app.use(cors())` enables Cross-Origin Resource Sharing. `app.use(express.json())` parses incoming JSON payloads.
*   **Lines 22-25**: Checks if an `uploads` directory exists. If not, it uses `fs.mkdirSync` to create it. This is crucial because `multer` will fail if its destination folder doesn't exist.
*   **Line 28**: Registers the resume routes using `app.use('/api/resume', resumeRoutes)`. Any request to `/api/resume/...` will be handled by the router defined in `resumeRoutes.js`.
*   **Lines 34-38**: A global error handling middleware. If any route calls `next(err)`, this catches it, logs it, and returns a standard `500` JSON response.
*   **Lines 40-44**: Starts the server listening on the `PORT` (defaults to 5000).

### 2. `backend/controllers/resumeController.js`
This file contains the core business logic.
*   **Lines 6-20**: The `uploadAndAnalyze` function is defined. It first checks if a file was actually uploaded (`req.file`). It validates that the mimetype is exactly `'application/pdf'`. It then checks if the file exceeds `5MB`. If any check fails, it immediately returns a `400 Bad Request`.
*   **Lines 21-25**: Extracts `jobDescription` from `req.body` and gets the physical file path. It calls `extractTextFromPDF(filePath)` (from `pdfService.js`) and waits for it to convert the PDF buffer into a plain text string.
*   **Lines 27-28**: Calls `analyzeResume(parsedText, jobDescription)` (from `aiService.js`). This sends the prompt to Hugging Face and returns a strictly formatted JSON object containing scores and keywords.
*   **Lines 30-43**: Wraps the MongoDB `Resume.create()` call in a `try-catch` block. This is a resilient design pattern; if the database is down, the user still gets their analysis results back instead of crashing the whole process.
*   **Lines 45-46**: Calls `fs.unlinkSync(filePath)` to delete the uploaded PDF from the local disk. This prevents the server's hard drive from filling up over time.
*   **Lines 48-56**: Returns a `200 OK` response with the parsed AI data combined with the database `_id`.

### 3. `backend/services/aiService.js`
This module interacts directly with the Hugging Face AI.
*   **Line 1**: Imports `HfInference` from `@huggingface/inference`.
*   **Lines 5-8**: Validates that `HUGGINGFACE_API_KEY` exists in the environment variables.
*   **Lines 12-29**: Defines the `prompt`. It uses ES6 template literals to inject the `jobDescription` and `resumeText`. Crucially, it instructs the AI to *only* output valid JSON in a very specific schema (`score`, `keywordsExtracted`, `missingKeywords`, `suggestions`).
*   **Lines 31-38**: Calls `hf.chatCompletion()`. It explicitly uses the `Qwen/Qwen2.5-72B-Instruct` model and passes the prompt as a `user` message. `temperature: 0.2` is set low to ensure the AI's response is deterministic and strictly formatted.
*   **Lines 43-52**: Uses a Regex `match(/\{[\s\S]*\}/)` to extract *only* the JSON portion of the AI's response. This is a safety measure in case the AI prepends text like "Here is your JSON:". It then parses it into a native JavaScript object and returns it.

### 4. `backend/services/pdfService.js`
A simple wrapper around the `pdf-parse` library.
*   **Line 6**: Uses `fs.readFileSync` to read the physical PDF file off the disk into a Node Buffer.
*   **Line 7**: Passes the buffer to `pdfParse()`, which decodes the PDF format and extracts the raw ASCII/UTF-8 text characters. 

---

## Part 2: Frontend Architecture (`/frontend`)

The frontend is a Vite + React application.

### 1. `frontend/src/apis/api.js`
The central location for all backend HTTP requests.
*   **Lines 4-5**: Defines `API_BASE_URL`.
*   **Lines 6-23**: The `uploadResume` asynchronous function. It instantiates a standard browser `FormData` object. It appends the `file` and conditionally appends the `jobDescription`. It then uses `axios.post` to send this to the backend. It explicitly sets the header `'Content-Type': 'multipart/form-data'` so Express and Multer know how to parse the incoming binary file.

### 2. `frontend/src/pages/Home.jsx`
The main view where users upload their resumes.
*   **Lines 7-11**: Uses React `useState` hooks to track the `file`, `jobDescription`, `loading` state, and any `error` messages.
*   **Lines 13-35**: The `handleAnalyze` function. It triggers when the user clicks the Analyze button. It sets `loading` to true, calls `uploadResume` from the API file, and waits for a response. If successful, it uses `useNavigate` from `react-router-dom` to dynamically transition to the `/dashboard` page, passing the `response.data` along in the router's internal state (`{ state: { analysis: response.data } }`).
*   **Lines 44-56**: Renders the `FileUpload` component and a `<textarea>` for the optional job description.
*   **Lines 69-75**: Conditionally renders a loading overlay with a CSS spinner (`<div className="spinner"></div>`) if the `loading` state is true.

### 3. `frontend/src/components/FileUpload.jsx`
Handles the complex Drag-and-Drop file UI.
*   **Lines 5-14**: `handleFileChange` triggers when a user clicks to browse for a file. It verifies the selected file is a PDF and sets it in the parent's state via the `setFile` prop.
*   **Lines 16-26**: `handleDrop` is wrapped in `useCallback`. It intercepts the default browser behavior of opening a dropped file in a new tab (`e.preventDefault()`). It grabs the file from `e.dataTransfer.files[0]`, validates it is a PDF, and sets it to state.
*   **Lines 38-44**: A hidden `<input type="file" style={{ display: 'none' }} />`. It is visually hidden, but linked to the UI via the `<label htmlFor="fileInput">`. Clicking the stylized drag-and-drop box actually clicks this hidden native file input.

### 4. `frontend/src/pages/Dashboard.jsx`
The results view.
*   **Lines 8-10**: Uses `useLocation` hook to extract the `analysis` data that was passed from `Home.jsx` during the navigation event.
*   **Lines 12-14**: A guard clause. If the user directly types `/dashboard` in the URL without analyzing a resume, `analysis` will be null, and they are immediately redirected back to `<Navigate to="/" />`.
*   **Lines 27-39**: Renders the CSS grid layout, passing the `analysis.score` into the `<ScoreDisplay />` component, and the `analysis.keywordsExtracted`, `missingKeywords`, and `suggestions` arrays into the `<KeywordList />` component.
