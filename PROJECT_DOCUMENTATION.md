# AI-Powered Resume Grader — Complete Project Documentation & Evaluator Guide

## 1. What is the Project About?
The **AI-Powered Resume Grader** is a full-stack SaaS (Software as a Service) platform designed to solve the single largest bottleneck in modern job applications: **Applicant Tracking Systems (ATS)**. 

When candidates submit a resume online, over 75% of submissions are automatically filtered out by enterprise ATS software (such as Workday, Taleo, Greenhouse, and Lever) before reaching a human recruiter. This platform acts as an automated, institutional-grade resume auditor:
* It analyzes candidate resumes against specific target job descriptions.
* It predicts the resume's ATS compatibility score (0 to 100).
* It performs a deep, 6-pillar audit across Content, Style, Skills, Format, Section-by-Section integrity, and Actionable Fixes.
* It presents real-time interactive visual graphs (SVG gauges, keyword density ratios, category breakdowns).
* It enables candidates to download an institutional-grade, multi-page vector PDF analysis report.

---

## 2. Why is it Useful? (Real-World Value)
1. **Eliminates Candidate Blind Spots**: Most job seekers do not know which keywords their resume is missing for a target job. The platform explicitly highlights matching vs. missing technical and soft skills.
2. **Actionable Blueprints Over Generic Advice**: Instead of saying *"improve your summary"*, the platform provides exact suggestions, recommended power verbs, and STAR-methodology metrics to incorporate.
3. **Saves Hiring Time & Boosts Callbacks**: Candidates can tailor their resume in under 2 minutes, dramatically boosting their interview callback rates.
4. **Historical Progress Tracking**: Candidates can store analyses in their personal dashboard, compare ATS score improvements over time, and revisit previous reports.

---

## 3. Tech Stack Breakdown (Explained in Simple Terms)

### Frontend Layer (User Interface)
* **React 18**: A modern JavaScript component library. It allows us to split the application into reusable pieces (Navigation Bar, Radial Gauges, Interactive Charts, Upload Dropzone, and Report Cards) that update instantly without reloading the browser.
* **Vite**: The modern frontend build tool that compiles and bundles React code significantly faster than older tools like Create React App.
* **Tailwind CSS**: A utility-first CSS framework that provides modern SaaS styling, responsive grid layouts (mobile, tablet, desktop), color palettes, and smooth transitions.
* **Lucide React**: Clean vector icons used across the landing page, dashboard metrics, and report status badges.
* **jsPDF**: A client-side library used to build and download formatted multi-page PDF documents directly in the candidate's browser without putting extra load on the backend server.

### Backend Layer (Application Server & API)
* **Node.js**: A fast, asynchronous JavaScript runtime that executes server-side code and handles concurrent file uploads and API requests smoothly.
* **Express.js**: A flexible web framework for Node.js. It manages REST API endpoints (`/api/auth/*` for registration and login, `/api/resume/*` for uploading, grading, and history retrieval), manages HTTP request/response headers, and runs security middlewares.
* **Multer**: Middleware designed for handling `multipart/form-data`. It receives the candidate's uploaded resume file and passes the raw buffer into memory for text processing.
* **pdf-parse**: A document extraction library that parses binary PDF data and extracts plain, unformatted text streams so the AI engine can inspect it.
* **JWT (JSON Web Tokens)**: Secure, stateless authentication tokens. When a user logs in, the backend signs a token containing the user's ID. The client attaches this token in the `Authorization` header to prove their identity safely without storing passwords in sessions.
* **bcryptjs**: An industry-standard encryption library that hashes user passwords using 10 cryptographic salt rounds before saving them to the database.

### Database Layer (Data Persistence)
* **MongoDB Atlas**: A fully managed cloud NoSQL document database. It is ideal for this application because resume analysis results are rich, nested JSON structures (containing arrays of keywords, category evaluations, and section scores) that map directly to MongoDB documents.
* **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js. It enforces schema structures, data types, default values, and relational links between Users and their analyzed Resumes.

### AI Inference Layer (Intelligence Engine)
* **Groq LPU (Language Processing Units)**: An ultra-fast hardware inference platform that runs high-capacity open-source LLMs (`qwen/qwen3.8-27b`, `openai/gpt-oss-120b`, `llama-3.3-70b-versatile`) at sub-second latency and zero cost.
* **Multi-Provider Fallback Architecture**: The system is designed to seamlessly fall back across Groq, Google Gemini, OpenRouter, and Hugging Face if one provider reaches rate limits.

---

## 4. End-to-End Data Flow (From Account Creation to PDF Download)

### Step 1: Account Creation & Sign In
1. The user visits the landing page at `/` and clicks **Create Free Account**.
2. The user fills in their Name, Email, and Password on the Register page.
3. The frontend sends `POST /api/auth/register` to the backend.
4. The backend checks if the email already exists, hashes the password using `bcryptjs` with 10 salt rounds, and saves a new user record in MongoDB.
5. The user logs in via `POST /api/auth/login`. The backend verifies the password, generates a signed JWT token, and sends it back to the client.
6. The client saves the token in `localStorage`. An Axios request interceptor attaches `Authorization: Bearer <token>` to every subsequent API call.

### Step 2: Resume Upload & Input Validation
1. The user navigates to `/analyze`.
2. The user drags and drops their resume into `FileUpload.jsx`. Client-side validation checks that the file is an authentic PDF and under 5MB.
3. The user inputs their target Job Description into the text area.
4. The user clicks **Analyze Resume**.
5. The frontend launches the animated **8-Stage Analysis Loader** (displaying stages such as *Extracting resume content*, *Analyzing job description*, *Identifying relevant skills*, and *Checking ATS compatibility*).

### Step 3: Text Extraction & Prompt Engineering
1. The frontend dispatches a `POST /api/resume/analyze` multipart request containing the file buffer, job description, and JWT.
2. The backend's `verifyToken` middleware validates the user's identity.
3. `Multer` catches the file stream, and `pdf-parse` extracts the clean, unformatted text from the PDF.
4. The backend builds a strict, structured evaluation prompt instructing the AI to act as an ATS software architect and evaluate the resume across 6 dimensions without hallucinating fake data.

### Step 4: AI Analysis & Response Normalization
1. The backend dispatches the prompt to Groq's high-speed inference engine (`temperature: 0.2` to eliminate hallucinations).
2. The AI returns a strict JSON object containing the overall ATS score, match percentage, keywords found, missing keywords, and evaluations for Content, Style, Skills, Format, and Individual Sections.
3. The backend's `normalizeAnalysisOutput()` function sanitizes the response, validates number bounds (0–100), and ensures exactly 6 prioritized actionable directives.
4. The complete analysis is saved in MongoDB linked to `req.user.id`.

### Step 5: Dashboard Visualization
1. The backend responds with the complete JSON payload.
2. The frontend stops the loader and redirects to `/results/:id`.
3. The candidate views the interactive report:
   * **Score Gauge**: Radial SVG dial showing the overall ATS rating.
   * **Keyword Density**: Donut chart and search-filterable pills showing matched vs. missing skills.
   * **Category Breakdown**: Progress meters for Content, Keywords, Style, and Format.
   * **6 Detailed Tabs**: In-depth recommendations for every resume section.

### Step 6: Multi-Page PDF Generation & Download
1. The user clicks **Download Report**.
2. The client invokes `pdfExportService.js` powered by `jsPDF`.
3. The engine uses a pre-flight height calculator (`checkPageBreak(neededHeight)`) to evaluate vertical space before rendering each card or title, eliminating heading overlaps.
4. It dynamically calculates text widths using `doc.getTextWidth()` to guarantee clean, non-colliding labels for Found vs. Missing keywords and 4-pillar bars.
5. The browser immediately downloads `Resume_Analysis_Report_<CandidateName>.pdf`.

---

## 5. What to Do When an AI API Key Expires (Key Rotation)

Because your backend uses a **multi-provider architecture**, changing or updating API keys takes under 60 seconds:

### Step 1: Get a Free New Key
* **Groq (Recommended - Fast & Free)**:
  1. Visit [console.groq.com](https://console.groq.com/) and create a free account.
  2. Click **API Keys** > **Create API Key**.
  3. Copy the key starting with `gsk_...`.

* **Alternative: Google Gemini API (Free Tier)**:
  1. Visit [aistudio.google.com](https://aistudio.google.com/) and click **Get API key**.
  2. Copy the key starting with `AIza...`.

### Step 2: Update Your Local Backend
1. Open `backend/.env`.
2. Replace:
   ```env
   GROQ_API_KEY=gsk_your_new_key_here
   ```
   *(Or if using Gemini: `GEMINI_API_KEY=your_gemini_key_here`)*
3. Save the file and restart your local backend server (`node server.js`).

### Step 3: Update Your Production Render Backend
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Select your Web Service.
3. Click **Environment** in the left sidebar.
4. Update `GROQ_API_KEY` with your new key.
5. Click **Save Changes**. Render will automatically restart your backend with zero downtime.

---

## 6. How to Deploy (Render Backend + Vercel Frontend)

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "feat: complete production saas platform"
git push origin main
```

### Step 2: Backend on Render
1. Open [Render Dashboard](https://dashboard.render.com/) > **New** > **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   * **Root Directory**: `backend`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Add **Environment Variables**:
   * `PORT`: `5000`
   * `MONGODB_URI`: `your_mongodb_connection_string`
   * `JWT_SECRET`: `your_jwt_secret_key`
   * `GROQ_API_KEY`: `gsk_...`
5. Click **Save Changes** / **Create Web Service**. Note the deployed URL (e.g. `https://ai-powered-resume-grader.onrender.com`).

### Step 3: Frontend on Vercel
1. Open [Vercel Dashboard](https://vercel.com/) > **New Project** > Import repository.
2. Configure settings:
   * **Root Directory**: `frontend`
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Add **Environment Variable**:
   * `VITE_API_URL`: `https://<your-render-backend-url>.onrender.com/api`
4. Click **Deploy**. Vercel will build and launch your live application with automatic SPA routing.
