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

## 5. File-by-File Breakdown: What Each File Does & How It Works

### Backend Architecture (`backend/`)

#### 1. `backend/server.js`
* **What it does**: The central application entry point for the Node/Express backend.
* **How it works**: Loads environment variables from `.env`, initializes CORS and JSON body-parser middlewares, ensures the `uploads/` directory exists, connects to MongoDB via `connectDB()`, mounts route handlers (`/api/resume`, `/api/auth`), configures global error-handling middleware, and binds the server to listen on `process.env.PORT || 5000`.

#### 2. `backend/config/db.js`
* **What it does**: Manages database connection to MongoDB Atlas.
* **How it works**: Uses `mongoose.connect()` with `process.env.MONGODB_URI`. Logs a success message on established connection or catches errors, logs the failure, and gracefully exits the process.

#### 3. `backend/controllers/authController.js`
* **What it does**: Handles user authentication, credential verification, and profile fetching.
* **How it works**:
  * `registerUser`: Validates input, verifies that the email isn't already taken, hashes the password via `bcrypt.hash(password, 10)`, and saves the new user to MongoDB.
  * `loginUser`: Finds the user by email, verifies the password with `bcrypt.compare()`, and returns a signed JWT token containing `{ id: user._id }` valid for 30 days.
  * `getUserProfile`: Extracts the user ID from the verified JWT in `req.user.id` and returns the sanitized user profile (excluding the password).

#### 4. `backend/controllers/resumeController.js`
* **What it does**: Orchestrates the entire lifecycle of resume uploads, AI analysis, database retrieval, and dashboard stats.
* **How it works**:
  * `uploadAndAnalyze`: Receives the uploaded PDF file via Multer, uses `pdf-parse` to extract plain text, sends the text and job description to `aiService.analyzeResume()`, saves the comprehensive result to MongoDB under `req.user.id`, and returns the created record.
  * `getRecentAnalyses`: Fetches the authenticated user's previous resume analyses sorted reverse-chronologically.
  * `getResumeById`: Fetches a single complete analysis by ID, verifying ownership by the requesting user.
  * `deleteResume`: Safely deletes an analysis document after confirming user ownership.
  * `getDashboardStats`: Calculates aggregate metrics (total resumes analyzed, average ATS score, highest score, and top missing keywords).

#### 5. `backend/middlewares/authMiddleware.js`
* **What it does**: Protects private API routes from unauthenticated access.
* **How it works**: Checks incoming requests for an `Authorization: Bearer <token>` header. Uses `jwt.verify(token, process.env.JWT_SECRET)` to decode the token. If valid, attaches the user object to `req.user` and calls `next()`; otherwise, rejects with `401 Unauthorized`.

#### 6. `backend/middlewares/uploadMiddleware.js`
* **What it does**: Configures file upload constraints and storage.
* **How it works**: Uses Multer with `multer.memoryStorage()` or disk storage, enforcing a 5MB size limit and validating that incoming file mimetypes match `application/pdf`.

#### 7. `backend/models/User.js`
* **What it does**: Defines the Mongoose database schema for registered candidates.
* **How it works**: Stores `name`, `email` (unique, lowercase), `password` (bcrypt hash), and automatic timestamps (`createdAt`, `updatedAt`).

#### 8. `backend/models/Resume.js`
* **What it does**: Defines the complete Mongoose schema for resume analysis results.
* **How it works**: Stores the candidate's `score`, `matchPercentage`, `summary`, `keywordsExtracted` (array), `missingKeywords` (array), `suggestions` (array), structured sub-documents for `overview`, `contentAnalysis`, `styleAnalysis`, `skillsAnalysis`, `formatAnalysis`, `sectionFeedback` (array), original filename, job description text, and a reference link to the `User` model.

#### 9. `backend/routes/authRoutes.js`
* **What it does**: Express router defining endpoints for candidate authentication.
* **How it works**: Maps `POST /register` to `registerUser`, `POST /login` to `loginUser`, and `GET /profile` to `getUserProfile` (guarded by `authMiddleware`).

#### 10. `backend/routes/resumeRoutes.js`
* **What it does**: Express router defining endpoints for resume operations.
* **How it works**: Maps `POST /analyze` (with `uploadMiddleware` and `authMiddleware`), `GET /recent`, `GET /stats`, `GET /:id`, and `DELETE /:id` to their respective controller functions.

#### 11. `backend/services/aiService.js`
* **What it does**: The central AI engine and prompt orchestrator.
* **How it works**: Constructs the multi-dimensional ATS evaluation prompt, executes the LLM query using ultra-fast Groq LPU inference (`qwen/qwen3.8-27b` $\to$ `openai/gpt-oss-120b` $\to$ `llama-3.3-70b-versatile`), handles automatic provider fallbacks (Google Gemini, OpenRouter, Hugging Face), and runs `normalizeAnalysisOutput()` to guarantee clean JSON structures, numeric boundary validations, and exactly 6 high-impact actionable fixes.

---

### Frontend Architecture (`frontend/`)

#### 1. `frontend/src/App.jsx`
* **What it does**: The client-side application root and routing coordinator.
* **How it works**: Uses `react-router-dom` to configure all SaaS routes:
  * Public routes: `/` (Landing Page), `/login`, `/register`, `/forgot-password`.
  * Protected routes (wrapped with `ProtectedRoute`): `/dashboard`, `/analyze`, `/results/:id`, `/history`, `/profile`.
  Renders the global `Navbar` and `Footer` across pages.

#### 2. `frontend/src/main.jsx`
* **What it does**: Mounts the React application into the browser DOM.
* **How it works**: Wraps the `<App />` component inside `<BrowserRouter>` and `<AuthProvider>` to provide routing and global authentication state to all components.

#### 3. `frontend/src/index.css`
* **What it does**: Global CSS styling and design system tokens.
* **How it works**: Imports Tailwind CSS utility directives (`@tailwind base; @tailwind components; @tailwind utilities;`), defines custom CSS variables, configures smooth scrolling, and customizes scrollbars and print rules.

#### 4. `frontend/src/apis/api.js`
* **What it does**: Centralized HTTP client managing all backend communications.
* **How it works**: Creates an Axios instance using `import.meta.env.VITE_API_URL`. Installs a request interceptor that retrieves the JWT from `localStorage` and attaches `Authorization: Bearer <token>` to all requests. Exports typed helper functions (`registerUser`, `loginUser`, `uploadResume`, `getResumeById`, `getRecentAnalyses`, `deleteResume`, `getDashboardStats`).

#### 5. `frontend/src/context/AuthContext.jsx`
* **What it does**: React Context managing candidate session and authentication state globally.
* **How it works**: Stores `user` object and `token`. On initial app load, verifies the stored token in `localStorage`, loads candidate profile info, and exposes `login()`, `register()`, and `logout()` helpers to all components.

#### 6. `frontend/src/services/pdfExportService.js`
* **What it does**: Client-side vector PDF generation engine.
* **How it works**: Powered by `jsPDF`. Implements a pre-flight calculation helper (`checkPageBreak(neededHeight)`) to prevent text or heading overlaps across page boundaries. Uses `doc.getTextWidth()` for dynamic, non-colliding badge positioning. Generates real vector graphs (ATS readiness bar, keyword ratio split bar, 4-pillar audit breakdown), color-coded pill tags, and dynamic page numbering (`Page X of Y`).

#### 7. `frontend/src/components/Navbar.jsx`
* **What it does**: SaaS header navigation bar.
* **How it works**: Dynamically adapts depending on authentication state. Shows brand logo, navigation links, and Login/Register CTA buttons for guests, or User Avatar, Dashboard, History, and Logout dropdowns for authenticated users. Includes a mobile slide-out drawer.

#### 8. `frontend/src/components/Footer.jsx`
* **What it does**: SaaS footer.
* **How it works**: Displays application branding, navigational links, system status indicators, ATS compliance guidelines, and copyright information.

#### 9. `frontend/src/components/AnalysisLoader.jsx`
* **What it does**: Unique animated loading experience during AI analysis.
* **How it works**: Displays a synchronized circular and linear progress percentage (0% to 100%) through 8 distinct sequential stages:
  1. Uploading and validating resume
  2. Extracting resume content
  3. Analyzing job description
  4. Identifying relevant skills
  5. Checking ATS compatibility
  6. Calculating matching keywords
  7. Generating improvement suggestions
  8. Preparing final report
  Includes "This usually takes 1–2 minutes" guidance, honest progression timers, and retry error handling.

#### 10. `frontend/src/components/FileUpload.jsx`
* **What it does**: Interactive drag-and-drop file upload zone.
* **How it works**: Uses HTML5 drag-and-drop events and native file inputs. Validates that the uploaded file is a PDF under 5MB, displays file name and size badges, and provides replace/remove controls.

#### 11. `frontend/src/components/ScoreGauge.jsx`
* **What it does**: Radial SVG ATS score visualization.
* **How it works**: Uses SVG circular stroke-dasharray calculations to animate a smooth radial progress dial from 0 to 100 with dynamic color grading (green for $\ge 75$, amber for $\ge 50$, red for $< 50$) and percentile badge.

#### 12. `frontend/src/components/KeywordsChart.jsx`
* **What it does**: Visual keyword alignment breakdown.
* **How it works**: Renders a proportional donut chart comparing matching vs. missing keywords, alongside searchable, filterable pill badges for discovered and gap keywords.

#### 13. `frontend/src/components/CategoryBreakdownChart.jsx`
* **What it does**: Visual 4-pillar category audit meter.
* **How it works**: Displays animated horizontal progress bars comparing candidate performance across Content, Keyword Alignment, Writing & Style, and ATS Formatting.

#### 14. `frontend/src/components/ProtectedRoute.jsx`
* **What it does**: Navigation guard for protected SaaS pages.
* **How it works**: Checks `AuthContext`. If the user is authenticated, renders the child component; if unauthenticated, redirects to `/login` while preserving the intended target URL.

#### 15. `frontend/src/pages/LandingPage.jsx`
* **What it does**: Public-facing SaaS marketing landing page at `/`.
* **How it works**: Features a conversion-optimized Hero section with primary and secondary CTAs, interactive product mockup preview, 6 core feature cards, a 3-step "How It Works" roadmap, ATS benefits comparison table, and interactive FAQ accordion.

#### 16. `frontend/src/pages/ResumeAnalyzer.jsx`
* **What it does**: Dedicated resume upload and grading workspace at `/analyze`.
* **How it works**: Combines `FileUpload.jsx`, a job description textarea with character counters, and action buttons. Dispatches the analysis request and transitions smoothly to `AnalysisLoader.jsx`.

#### 17. `frontend/src/pages/AnalysisReport.jsx`
* **What it does**: The comprehensive results dashboard at `/results/:id`.
* **How it works**: Displays the complete 6-pillar analysis across interactive tabs:
  * Tab A: Overview & Scorecard (ScoreGauge, KeywordsChart, CategoryBreakdownChart)
  * Tab B: Content Analysis (Summary, Experience, Metrics, Projects, Education evaluations)
  * Tab C: Style & Writing (Grammar, scanability, tone, action verb audit)
  * Tab D: Skills Breakdown (Matching vs. missing technical and soft skills)
  * Tab E: Format & ATS Integrity (Structure, layout, parsing flags)
  * Tab F: Section-by-Section Quality (Granular assessments, issues, blueprints)
  * Actionable Fixes: Exactly 6 prioritized recommendations
  Provides a primary **Download Report** trigger connecting to `pdfExportService.js`.

#### 18. `frontend/src/pages/Dashboard.jsx`
* **What it does**: Candidate personal workspace at `/dashboard`.
* **How it works**: Displays a personalized welcome banner, 4 KPI statistics cards (Total Resumes Analyzed, Average ATS Score, Highest Score, Missing Keyword Frequency), a list of recent analyses with quick-view links, and a prominent "Analyze New Resume" button.

#### 19. `frontend/src/pages/History.jsx`
* **What it does**: Analysis archive management at `/history`.
* **How it works**: Fetches all previous resume evaluations, provides a live search bar and score filter pills (All, High 75+, Moderate 50–74, Needs Work <50), and allows users to reopen reports, download PDF audits, or safely delete records with modal confirmation.

#### 20. `frontend/src/pages/Profile.jsx`
* **What it does**: Candidate account and security settings at `/profile`.
* **How it works**: Shows candidate name, email, account join date, security overview, and cumulative statistics.

#### 21. `frontend/src/pages/Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`
* **What it does**: User authentication and account recovery interfaces.
* **How it works**: Built with real-time client-side form validation, password visibility toggles, loading indicators, and error banners that interface with `AuthContext`.

---

## 6. What to Do When an AI API Key Expires (Key Rotation)

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

## 7. How to Deploy New Updates (Render Backend + Vercel Frontend)

### Step 1: Push Changes to GitHub
Since your existing Render and Vercel projects are already connected to your GitHub repository, pushing to `main` triggers automated CI/CD builds:
```bash
git add .
git commit -m "feat: complete production saas platform"
git push origin main
```

### Step 2: Verify Backend on Render
1. Open [Render Dashboard](https://dashboard.render.com/) $\to$ select your existing Web Service.
2. Under **Environment Variables**, verify all four variables exist:
   * `PORT`: `5000`
   * `MONGODB_URI`: `your_mongodb_connection_string`
   * `JWT_SECRET`: `your_jwt_secret_key`
   * `GROQ_API_KEY`: `gsk_...`
3. If auto-deploy is enabled, Render will deploy automatically. If not, click **Manual Deploy** > **Deploy latest commit**.

### Step 3: Verify Frontend on Vercel
1. Open [Vercel Dashboard](https://vercel.com/) $\to$ select your existing project.
2. Under **Settings** > **Environment Variables**, ensure:
   * `VITE_API_URL`: `https://<your-render-backend-url>.onrender.com/api`
3. Go to **Deployments**. The latest commit will build automatically. The included `vercel.json` ensures client-side routes (`/dashboard`, `/analyze`, `/results/:id`) work smoothly without 404s.
