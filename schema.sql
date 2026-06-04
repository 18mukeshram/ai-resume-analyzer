-- ============================================
-- AI Resume Analyzer - Database Schema (MySQL)
-- ============================================

CREATE DATABASE IF NOT EXISTS ai_resume_analyzer;
USE ai_resume_analyzer;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Analyses Table
CREATE TABLE IF NOT EXISTS analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  resumeName VARCHAR(255) NOT NULL,
  jobDescription TEXT NOT NULL,
  resumeText TEXT,
  matchScore INT DEFAULT 0,
  matchedSkills JSON,
  missingSkills JSON,
  improvements JSON,
  interviewQuestions JSON,
  summary TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster lookups
CREATE INDEX idx_analyses_userId ON analyses(userId);
