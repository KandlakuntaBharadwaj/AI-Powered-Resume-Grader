# AI-Powered Resume Grader: Comprehensive Code Breakdown

This document provides a highly detailed, line-by-line, and block-by-block explanation of the code for every crucial file in the Backend and Frontend of the AI-Powered Resume Grader application. 

---

## 🛠️ PART 1: Backend Architecture (`/backend`)

The backend is built using **Node.js** and **Express.js**. Its primary responsibilities are handling file uploads, extracting text from PDFs, sending that text to the Hugging Face AI for analysis, and saving the results to a MongoDB database.

### 1. `backend/server.js`
This is the **entry point** of your backend application. It sets up the server and ties all the different pieces together.

*   **Imports & Setup**:
    *   `express`: The framework used to create the web server.
    *   `dotenv`: Loads environment variables (like API keys) from the `.env` file so they aren't hardcoded.
    *   `cors`: (Cross-Origin Resource Sharing) Allows your frontend (running on Vercel) to talk to your backend (running on Render) without security blocks.
    *   `connectDB`: A custom function imported to establish the MongoDB connection.
    *   `fs` & `path`: Built-in Node.js modules used for reading/writing files and handling directory paths.
*   **Initialization**:
    *   `dotenv.config()` is called immediately to make variables available in `process.env`.
    *   `connectDB()` is called to connect to the database.
    *   `const app = express()` creates the actual server instance.
*   **Middlewares**:
    *   `app.use(cors())`: Activates CORS.
    *   `app.use(express.json())`: Tells the server to automatically parse incoming JSON data in the request body.
*   **Uploads Directory Management**:
    *   The code checks if a folder named `uploads` exists using `fs.existsSync()`.
    *   If it does not exist, it creates it using `fs.mkdirSync()`. This is absolutely critical because the file uploader (`multer`) will crash if the destination folder is missing.
*   **Routing**:
    *   `app.use('/api/resume', resumeRoutes)`: This links the URL path `/api/resume` to the routes defined in the `resumeRoutes.js` file.
*   **Error Handling**:
    *   An `app.use((err, req, res, next))` block acts as a global safety net. If any code throws an error, this catches it, logs it, and prevents the server from crashing, returning a neat `500 Server Error` response instead.
*   **Server Start**:
    *   `app.listen(PORT, ...)` tells the server to turn on and start listening for web traffic on the specified port.

---

### 2. `backend/controllers/resumeController.js`
This file contains the **"brain"** or business logic of the app. It dictates exactly what happens when a user uploads a resume.

*   **Initial Validation (Lines 6-20)**:
    *   The `uploadAndAnalyze` function is defined to handle the request.
    *   **File Check**: It checks `if (!req.file)`. If the user didn't attach a file, it returns an error immediately.
    *   **Type Check**: It ensures `req.file.mimetype === 'application/pdf'`. If someone uploads an image or a Word doc, it blocks it.
    *   **Size Check**: It calculates the max size (`5 * 1024 * 1024` = 5 Megabytes). If the file is too large, it is rejected.
*   **Data Extraction (Lines 21-26)**:
    *   It grabs the optional `jobDescription` from the request body.
    *   It grabs the `filePath` of the newly uploaded PDF.
    *   It calls `await extractTextFromPDF(filePath)` which reads the physical PDF file and converts it into a raw string of text.
*   **AI Analysis (Lines 27-29)**:
    *   It calls `await analyzeResume(parsedText, jobDescription)`. This pauses the function while the text is sent to Hugging Face, waiting for the AI to read the resume and grade it.
*   **Database Saving (Lines 30-44)**:
    *   It creates a new database record using `Resume.create({...})`.
    *   It saves the original filename, the parsed text, and all the specific AI feedback (score, keywords, suggestions).
    *   **Important**: This is wrapped in a `try...catch` block. If the database goes offline, the app doesn't crash; it just skips saving and still returns the grading results to the user.
*   **Cleanup (Lines 45-47)**:
    *   `fs.unlinkSync(filePath)` deletes the uploaded PDF from the server's hard drive. This is crucial so your server doesn't run out of storage space over time.
*   **Response (Lines 48-56)**:
    *   Sends a `200 OK` JSON response back to the frontend, packed with the success message and all the AI analysis data.

---

### 3. `backend/services/aiService.js`
This file specifically handles **talking to the Hugging Face AI API**.

*   **Setup**:
    *   Imports `HfInference` from the `@huggingface/inference` library.
    *   Checks for `process.env.HUGGINGFACE_API_KEY`. If missing, it throws an error immediately to warn you.
    *   Initializes the connection with `const hf = new HfInference(apiKey)`.
*   **The Prompt Design**:
    *   A large template string (`prompt`) is created. This is the exact instruction set sent to the AI.
    *   It tells the AI: "You are an expert ATS..."
    *   It strictly instructs the AI to return data in a **JSON format** with specific keys: `score`, `keywordsExtracted`, `missingKeywords`, and `suggestions`.
*   **Making the Request**:
    *   `hf.chatCompletion({...})` is called.
    *   **Model**: It specifically uses `Qwen/Qwen2.5-72B-Instruct` (a highly intelligent model good at following instructions).
    *   **Temperature**: Set to `0.2`. Temperature controls creativity. A low temperature makes the AI more robotic, strict, and predictable, which is exactly what we want for formatting JSON data.
*   **Data Cleaning (Regex)**:
    *   Sometimes AI adds conversational text like "Here is your JSON: { ... }".
    *   The code `responseText.match(/\{[\s\S]*\}/)` is a Regular Expression that scans the AI's response, completely ignores conversational text, and forcefully extracts ONLY the JSON object.
    *   `JSON.parse()` turns that text into a usable JavaScript object.

---

### 4. `backend/services/pdfService.js`
A small but vital file that reads PDFs.

*   **Process**:
    *   `fs.readFileSync(filePath)` opens the PDF file and reads its raw binary data into a Buffer.
    *   `pdfParse(dataBuffer)` (using the external `pdf-parse` library) processes that binary data, strips away the images and formatting, and returns just the raw, readable text characters so the AI can understand it.

---

## 💻 PART 2: Frontend Architecture (`/frontend`)

The frontend is a **React** application built with **Vite**. Its job is to provide a beautiful user interface, handle file drag-and-drop, and visually display the AI's grading.

### 1. `frontend/src/apis/api.js`
This file acts as the **bridge** between the frontend and the backend.

*   **Base URL**:
    *   `const API_BASE_URL = 'https://ai-powered-resume-grader.onrender.com/api'` defines where the backend lives.
*   **The `uploadResume` Function**:
    *   Takes the `file` and `jobDescription` as arguments.
    *   Creates a `new FormData()` object. (Standard JSON cannot transmit physical files, so `FormData` is required for file uploads).
    *   Appends the file and description to this form.
    *   Uses `axios.post()` to send this data to the backend.
    *   **Crucial Header**: Sets `Content-Type: multipart/form-data` so the backend knows a file is incoming.

---

### 2. `frontend/src/pages/Home.jsx`
The **Landing Page** of the website.

*   **State Management (Hooks)**:
    *   Uses `useState` extensively to remember the current state of the page:
        *   `file`: The PDF the user selected.
        *   `jobDescription`: The text the user typed.
        *   `loading`: A true/false toggle to show or hide the loading spinner.
        *   `error`: Stores error messages to show the user if something fails.
*   **The `handleAnalyze` Function**:
    *   Triggered when the user clicks "Analyze Resume".
    *   It turns on the loading spinner (`setLoading(true)`).
    *   It calls `uploadResume()` (from `api.js`) and waits for the backend to finish.
    *   **Routing**: If successful, it uses React Router's `navigate('/dashboard', { state: { analysis: response.data } })`. This magically teleports the user to the Results page *while* carrying the AI data with them in the background state.
*   **Render (UI)**:
    *   Displays the title, the `FileUpload` component, and a text area for the job description.
    *   Conditionally renders a `<div className="loading-overlay">` if `loading` is true, blocking the screen while the AI thinks.

---

### 3. `frontend/src/components/FileUpload.jsx`
The interactive **Drag-and-Drop** box.

*   **`handleFileChange`**:
    *   Runs if the user clicks the box and selects a file from their computer folders.
    *   Checks `selectedFile.type !== 'application/pdf'` to reject non-PDFs.
*   **`handleDrop`**:
    *   Wrapped in `useCallback` for performance.
    *   Runs if the user drags a file from their desktop and drops it on the browser.
    *   Calls `e.preventDefault()` to stop the browser's default behavior (which is to open the PDF in the current tab, ruining the app experience).
    *   Grabs the file from `e.dataTransfer.files[0]`.
*   **The Hidden Input**:
    *   There is a `<input type="file" style={{ display: 'none' }} />`. It is completely invisible.
    *   It is wrapped in a `<label>`. Because of how HTML works, clicking the large, beautifully styled label automatically clicks the invisible file input, opening the file browser cleanly.

---

### 4. `frontend/src/pages/Dashboard.jsx`
The **Results Page** that shows the final grades.

*   **Data Retrieval**:
    *   Uses `useLocation()` to grab the `analysis` data that the `Home.jsx` page sent over during navigation.
*   **Security/Guard Clause**:
    *   Checks `if (!analysis)`. If a user just types "yourwebsite.com/dashboard" into their URL bar without actually uploading a resume, `analysis` will be empty. The app catches this and instantly kicks them back to the home page using `<Navigate to="/" />`.
*   **Layout**:
    *   Renders a grid.
    *   Passes `analysis.score` into the `<ScoreDisplay />` component so it can draw a visual score.
    *   Passes `analysis.keywordsExtracted`, `missingKeywords`, and `suggestions` into the `<KeywordList />` component to render them as neat bullet points or tags.
