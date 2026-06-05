# 🧠 ResumeAI — AI-Powered Resume Analyzer

ResumeAI is a full-stack web application designed to help job seekers and recruiters analyze resumes against job descriptions. Powered by **Google Gemini 3.5 Flash**, the app extracts text from resumes, performs dynamic semantic matching against job requirements, and provides actionable insights including match scores, missing skills, improvement tips, and custom interview questions.

---

### 🌐 Live Links
* **Live Demo (Frontend)**: [https://ai-resume-analyzer-frontend-lemon.vercel.app/](https://ai-resume-analyzer-frontend-lemon.vercel.app/)
* **API Server (Backend)**: [https://ai-resume-analyzer-backend-5bu0.onrender.com/](https://ai-resume-analyzer-backend-5bu0.onrender.com/)

---

## 🚀 Key Features

* **Drag & Drop Upload**: Support for parsing text from PDF and DOCX files.
* **Semantic Match Score**: Interactive gauge displaying an ATS-style match percentage based on the job description.
* **Skills Gap Analysis**: Side-by-side breakdown highlighting matching skills and identifying missing keywords.
* **Tailored Improvements**: Specific, actionable recommendations to align the resume closer to the target role.
* **AI-Generated Interview Questions**: Custom interview questions generated dynamically from identified skill gaps.
* **PDF Report Export**: Allows users to download a summary of the analysis report locally.
* **Theme Customization**: Responsive dark and light theme settings.
* **Persistent History**: Keeps track of all past analyses on a left-sidebar panel, loaded directly from the database.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, Vanilla CSS, jsPDF, html2canvas
* **Backend**: Node.js, Express.js, Sequelize ORM, Multer
* **AI Engine**: Google Gemini 3.5 Flash (via `@google/generative-ai`)
* **Authentication**: JSON Web Tokens (JWT) + bcryptjs
* **Database**: SQLite (default for development/demo) / MySQL (ready for production)
* **File Processing**: pdf-parse, mammoth

---

## 🏗️ Project Architecture

```
ai-resume-analyzer/
├── backend/                    # Express API Server
│   ├── src/
│   │   ├── config/db.js        # Sequelize connection configuration
│   │   ├── controllers/        # Auth & Analysis business logic
│   │   ├── middleware/auth.js   # JWT verification middleware
│   │   ├── models/             # Sequelize database schemas
│   │   ├── routes/             # Route declarations
│   │   ├── services/aiService.js # Gemini 3.5 API integration service
│   │   └── index.js            # Express entry point
│   ├── .env.example
│   └── package.json
├── frontend/                   # React Single Page App
│   ├── src/
│   │   ├── components/         # Auth, Navbar, Dashboard, History UI
│   │   ├── styles/main.css     # Unified glassmorphic CSS design system
│   │   ├── App.jsx             # Main router and state coordinator
│   │   └── main.jsx            # React mounting file
│   └── package.json
├── schema.sql                  # MySQL database creation script
├── package.json                # Root package configurations
└── README.md
```

---

## 💻 Local Installation & Setup

If you want to run this project locally, follow these steps:

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (comes bundled with Node)
* A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey) (Free tier works perfectly)

### 1. Clone the Repository
```bash
git clone https://github.com/18mukeshram/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Install Dependencies
Install all package dependencies for the root workspace, frontend, and backend folders with a single script:
```bash
npm run install:all
```

### 3. Environment Setup
Configure your environment variables for the backend:
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and fill in your details:
```env
PORT=5000
JWT_SECRET=any_secure_random_string_here
GEMINI_API_KEY=your_google_gemini_api_key_here
DB_DIALECT=sqlite
```

### 4. Run the Development Servers
Start both the React dev server and the Express API server concurrently:
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

---

## 🗄️ Database Configurations

This application uses **Sequelize ORM**, allowing you to switch between SQLite and MySQL instantly by changing your configuration.

### Option A: SQLite (Default — Zero Setup)
No database server installation is required. A `database.sqlite` file is automatically created inside the `backend` folder on the first launch.

### Option B: MySQL (Production Ready)
1. Initialize the tables using the provided schema:
   ```bash
   mysql -u root -p < schema.sql
   ```
2. Update the environment variables in `backend/.env`:
   ```env
   DB_DIALECT=mysql
   DB_HOST=localhost
   DB_NAME=ai_resume_analyzer
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   ```

---

## 🔌 API Endpoints

### Authentication Routes
* `POST /api/auth/register` — Create a new account.
* `POST /api/auth/login` — Sign in and receive a JWT.
* `GET /api/auth/me` — Verify and fetch active session details.

### Analysis Routes
* `POST /api/analysis/analyze` — Upload a resume (PDF/DOCX) and paste a job description. Returns the parsed AI analysis.
* `GET /api/analysis/history` — Get all past resume analyses for the logged-in user.
* `DELETE /api/analysis/:id` — Delete a specific analysis record by ID.
