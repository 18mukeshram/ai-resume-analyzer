# 🧠 ResumeAI — AI-Powered Resume Analyzer

An intelligent web application that analyzes resumes against job descriptions using **Google Gemini AI**. Get instant match scores, identify skill gaps, receive improvement suggestions, and prepare for interviews.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue?style=flat-square) ![Backend](https://img.shields.io/badge/Node.js-Express-green?style=flat-square) ![AI](https://img.shields.io/badge/AI-Gemini%201.5-purple?style=flat-square) ![DB](https://img.shields.io/badge/DB-SQLite%20%7C%20MySQL-orange?style=flat-square)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 Resume Upload | Upload PDF or DOCX resumes with drag & drop |
| 💼 JD Matching | Paste any job description for comparison |
| 🤖 AI Analysis | Gemini 1.5 Flash analyzes skills, gaps & fit |
| 📊 Match Score | Visual circular gauge showing match percentage |
| 🎯 Skills Comparison | Side-by-side matched vs. missing skills |
| 💡 Improvements | Actionable suggestions to strengthen your resume |
| ❓ Interview Prep | AI-generated interview questions based on gaps |
| 📥 PDF Report | Download full analysis report as PDF |
| 🌓 Dark/Light Mode | Toggle between themes |
| 🔐 Authentication | JWT-based login & registration |
| 📋 History | All past analyses stored and accessible |
| 🗄️ Database | SQLite (default) or MySQL support |

## 🏗️ Architecture

```
ai-resume-analyzer/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/db.js        # Sequelize DB config
│   │   ├── controllers/        # Auth & Analysis logic
│   │   ├── middleware/auth.js   # JWT middleware
│   │   ├── models/             # User & Analysis models
│   │   ├── routes/             # API routes
│   │   ├── services/aiService.js # Gemini AI integration
│   │   └── index.js            # Server entry
│   ├── .env.example
│   └── package.json
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/         # Auth, Navbar, Dashboard, History
│   │   ├── styles/main.css     # Design system
│   │   ├── App.jsx             # Root component
│   │   └── main.jsx            # Entry point
│   └── package.json
├── schema.sql                  # MySQL schema
├── package.json                # Root scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm**
- **Gemini API Key** — [Get one free from Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer
npm run install:all
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_key_here
```

### 3. Run the App

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

Open **http://localhost:5173** in your browser.

### 4. Use the App
1. **Register** a new account
2. **Upload** a resume (PDF/DOCX)
3. **Paste** a job description
4. Click **Analyze Resume**
5. View your match score, skills comparison, improvements, and interview questions
6. **Download** the report as PDF

## 🗄️ Database

### SQLite (Default — Zero Setup)
Works out of the box. A `database.sqlite` file is created automatically.

### MySQL (Optional)
1. Create the database using `schema.sql`:
   ```bash
   mysql -u root -p < schema.sql
   ```
2. Update `backend/.env`:
   ```env
   DB_DIALECT=mysql
   DB_HOST=localhost
   DB_NAME=ai_resume_analyzer
   DB_USER=root
   DB_PASSWORD=your_password
   ```

## 📐 Database Schema

See [schema.sql](./schema.sql) for the full MySQL-compatible schema.

| Table | Fields |
|-------|--------|
| **users** | id, username, email, password (hashed), createdAt, updatedAt |
| **analyses** | id, userId (FK), resumeName, jobDescription, resumeText, matchScore, matchedSkills, missingSkills, improvements, interviewQuestions, summary, createdAt, updatedAt |

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Sign in |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/analysis/analyze` | ✅ | Upload resume + JD for analysis |
| GET | `/api/analysis/history` | ✅ | Get past analyses |
| DELETE | `/api/analysis/:id` | ✅ | Delete an analysis |

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Vanilla CSS, jsPDF, html2canvas
- **Backend**: Node.js, Express.js, Sequelize ORM
- **AI**: Google Gemini 1.5 Flash via `@google/generative-ai`
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Database**: SQLite3 (default) / MySQL
- **File Parsing**: pdf-parse, mammoth

## 📄 License

MIT
